import { WebSocket, WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: process.env.PORT ? parseInt(process.env.PORT) : 8080 });

// In-memory registry of connected users.
// Each entry holds the WebSocket connection, the rooms the user has joined,
// and the authenticated userId from their JWT.
interface User {
  ws: WebSocket;
  rooms: string[]; // Store all roomIds as strings for consistent comparison
  userId: string;
}
const users: User[] = [];

/**
 * Validates a JWT token and extracts the userId.
 * Returns null if the token is missing, malformed, expired, or has no userId.
 * The try/catch here is essential — jwt.verify throws on any invalid token.
 */
function checkUser(token: string): string | null {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // jwt.verify can return a string for unsupported token types
    if (typeof decoded === "string") return null;

    if (!decoded || !decoded.userId) return null;

    return decoded.userId;
  } catch (e) {
    // Catches: jwt malformed, jwt expired, invalid signature, etc.
    return null;
  }
  // Note: no unreachable return here (previous code had one after the catch block)
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }

  // Extract the token from the query string: ws://host?token=xxx
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);

  // Reject the connection immediately if the token is invalid.
  // Closing without sending anything is the standard WS rejection pattern.
  if (userId === null) {
    ws.close();
    return;
  }

  // Register this user in the in-memory list
  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on('message', async function message(data) {
    let parsedData: any;

    // Safely parse the incoming JSON message — malformed JSON should not crash the server
    try {
      parsedData = JSON.parse(data as unknown as string);
    } catch {
      console.error("WS: received non-JSON message, ignoring.");
      return;
    }

    if (parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws);
      if (!user) return;

      // Normalize roomId to a string so comparisons are always consistent.
      // Without this, Number vs String comparisons in includes() silently fail.
      const roomId = String(parsedData.roomId);

      // Only add if not already joined (prevents duplicates)
      if (!user.rooms.includes(roomId)) {
        user.rooms.push(roomId);
      }
    }

    if (parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws);
      if (!user) return;

      const roomId = String(parsedData.roomId);

      // Bug fix: was `=== parsedData.room` which kept the leaving room and
      // removed everything else. Correct behaviour is to EXCLUDE the leaving room.
      user.rooms = user.rooms.filter(x => x !== roomId);
    }

    if (parsedData.type === "chat") {
      // Normalize roomId to string for consistent in-memory comparisons
      const roomId = String(parsedData.roomId);
      const message = parsedData.message;

      // Persist the chat message to the database
      await prismaClient.chat.create({
        data: {
          roomId: Number(roomId), // DB schema stores roomId as Int
          message,
          userId,
        },
      });

      // Broadcast to all other users who have joined this room.
      // Skip the sender (user.ws !== ws).
      users.forEach(user => {
        if (user.rooms.includes(roomId) && user.ws !== ws) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message,
            roomId,
          }));
        }
      });
    }

    if (parsedData.type === "erase") {
      const roomId = String(parsedData.roomId);
      const shapeId = parsedData.shapeId;

      // Find the chat entry that contains this shape's unique ID and delete it
      const roomChats = await prismaClient.chat.findMany({
        where: { roomId: Number(roomId) },
      });
      const chatToDelete = roomChats.find(chat => chat.message.includes(shapeId));
      
      if (chatToDelete) {
        await prismaClient.chat.delete({
          where: { id: chatToDelete.id }
        });
      }

      users.forEach(user => {
        if (user.rooms.includes(roomId) && user.ws !== ws) {
          user.ws.send(JSON.stringify({
            type: "erase",
            shapeId,
            roomId,
          }));
        }
      });
    }

    if (parsedData.type === "update") {
      const roomId = String(parsedData.roomId);
      const shapeId = parsedData.shapeId;
      const message = parsedData.message;

      // Find the chat entry that contains this shape's unique ID and update its payload
      const roomChats = await prismaClient.chat.findMany({
        where: { roomId: Number(roomId) },
      });
      const chatToUpdate = roomChats.find(chat => chat.message.includes(shapeId));
      
      if (chatToUpdate) {
        await prismaClient.chat.update({
          where: { id: chatToUpdate.id },
          data: { message }
        });
      }

      users.forEach(user => {
        if (user.rooms.includes(roomId) && user.ws !== ws) {
          user.ws.send(JSON.stringify({
            type: "update",
            message,
            roomId,
          }));
        }
      });
    }
  });

  // Clean up: remove the user from the registry when they disconnect.
  // Without this, the users array grows forever and disconnected sockets
  // accumulate, causing memory leaks and stale broadcast attempts.
  ws.on('close', () => {
    const index = users.findIndex(x => x.ws === ws);
    if (index !== -1) {
      users.splice(index, 1);
    }
  });
});