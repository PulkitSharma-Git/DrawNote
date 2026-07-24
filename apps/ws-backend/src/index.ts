import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

// For Render cold starts.
// We create a small HTTP server and attach the WebSocketServer to it.
// This lets us expose a /health endpoint so the frontend can wait until
// the backend is awake before opening a WebSocket connection.

// NOTE:
// createServer comes from Node.js ("http"), NOT Express.
// No Express is used here—it's just Node's built-in HTTP server + ws library
// /health endpoint: That's a tiny amount of HTTP functionality. Using Express just for that is like bringing a toolbox to tighten one screw. The built-in http module already does exactly what you need with minimal code.
// So it does not make sense to import a whole lib just for one endpoint
// and since express is not used thats why the code looks bulky

//------------------------------------
import { createServer } from "http";

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;

const server = createServer((req, res) => {
  // Handle CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, HEAD");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (
    req.url === "/health" &&
    (req.method === "GET" || req.method === "HEAD")
  ) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "healthy",
        timestamp: new Date().toISOString(),
      }),
    );
  } else {
    res.writeHead(404);
    res.end();
  }
});

//------------------------------------------

const wss = new WebSocketServer({ server });

server.listen(port, () => {
  console.log(`WebSocket server starting on port ${port}`);
});

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
}

async function broadcastRoomUsers(roomId: string) {
  // Find all currently connected sockets that have joined this room
  const clientsInRoom = users.filter((u) => u.rooms.includes(roomId));

  // Extract unique userIds
  const uniqueUserIds = [...new Set(clientsInRoom.map((u) => u.userId))];

  // Fetch from DB
  const dbUsers = await prismaClient.user.findMany({
    where: { id: { in: uniqueUserIds } },
    select: { id: true, name: true, photo: true },
  });

  // Broadcast to all clients in this room (including the sender so their UI updates)
  const message = JSON.stringify({
    type: "room_users",
    users: dbUsers,
    roomId,
  });
  clientsInRoom.forEach((client) => {
    client.ws.send(message);
  });
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }

  // Extract the token from the query string: ws://host?token=xxx
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
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

  ws.on("message", async function message(data) {
    let parsedData: any;

    // Safely parse the incoming JSON message — malformed JSON should not crash the server
    try {
      parsedData = JSON.parse(data as unknown as string);
    } catch {
      console.error("WS: received non-JSON message, ignoring.");
      return;
    }

    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) return;

      // Normalize roomId to a string so comparisons are always consistent.
      // Without this, Number vs String comparisons in includes() silently fail.
      const roomId = String(parsedData.roomId);

      // Only add if not already joined (prevents duplicates)
      if (!user.rooms.includes(roomId)) {
        user.rooms.push(roomId);
        broadcastRoomUsers(roomId);
      }
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) return;

      const roomId = String(parsedData.roomId);

      // Bug fix: was `=== parsedData.room` which kept the leaving room and
      // removed everything else. Correct behaviour is to EXCLUDE the leaving room.
      user.rooms = user.rooms.filter((x) => x !== roomId);
      broadcastRoomUsers(roomId);
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
      users.forEach((user) => {
        if (user.rooms.includes(roomId) && user.ws !== ws) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message,
              roomId,
            }),
          );
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
      const chatToDelete = roomChats.find((chat) =>
        chat.message.includes(shapeId),
      );

      if (chatToDelete) {
        await prismaClient.chat.delete({
          where: { id: chatToDelete.id },
        });
      }

      users.forEach((user) => {
        if (user.rooms.includes(roomId) && user.ws !== ws) {
          user.ws.send(
            JSON.stringify({
              type: "erase",
              shapeId,
              roomId,
            }),
          );
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
      const chatToUpdate = roomChats.find((chat) =>
        chat.message.includes(shapeId),
      );

      if (chatToUpdate) {
        await prismaClient.chat.update({
          where: { id: chatToUpdate.id },
          data: { message },
        });
      }

      users.forEach((user) => {
        if (user.rooms.includes(roomId) && user.ws !== ws) {
          user.ws.send(
            JSON.stringify({
              type: "update",
              message,
              roomId,
            }),
          );
        }
      });
    }
  });

  // Clean up: remove the user from the registry when they disconnect.
  // Without this, the users array grows forever and disconnected sockets
  // accumulate, causing memory leaks and stale broadcast attempts.
  ws.on("close", () => {
    const index = users.findIndex((x) => x.ws === ws);
    if (index !== -1) {
      const user = users[index];
      if (user) {
        const userRooms = [...user.rooms];
        users.splice(index, 1);
        userRooms.forEach((roomId) => broadcastRoomUsers(roomId));
      }
    }
  });
});
