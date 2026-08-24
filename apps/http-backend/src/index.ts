import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import cors from "cors";
import bcrypt from "bcryptjs";
import { validate } from "./validate";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.post("/signup", validate(CreateUserSchema), async (req, res) => {
  const { username, password, name } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prismaClient.user.create({
      data: {
        email: username,
        password: hashedPassword,
        name: name,
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (e) {
    res.status(411).json({
      message: "User already exists with this username",
    });
  }
});

app.post("/signin", validate(SigninSchema), async (req, res) => {
  const { username, password } = req.body;

  const user = await prismaClient.user.findFirst({
    where: {
      email: username,
    },
  });

  if (!user) {
    res.status(403).json({
      message: "Not authorized",
    });
    return;
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    res.status(403).json({
      message: "Not authorized",
    });
    return;
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );

  res.json({
    token,
  });
});

app.get("/getRooms", middleware, async (req, res) => {
  const userId = req.userId;

  try {
    const rooms = await prismaClient.room.findMany({
      where: {
        adminId: userId,
      },
    });

    res.json({ rooms });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/room", middleware, validate(CreateRoomSchema), async (req, res) => {
  const { name } = req.body;
  // @ts-ignore: TODO: Fix this
  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: name,
        adminId: userId as string,
      },
    });

    res.json({
      roomId: room.id,
    });
  } catch (e) {
    res.status(500).json({
      message: "Error processing room",
    });
  }
});

app.get("/chats/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);

  if (isNaN(roomId)) {
    res.status(400).json({
      message: "Invalid room ID",
    });
    return;
  }

  try {
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 1000,
    });

    res.json({
      messages,
    });
  } catch (e) {
    console.error(e);

    res.status(500).json({
      messages: [],
    });
  }
});

app.get("/room/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);

  if (isNaN(roomId)) {
    res.status(400).json({ message: "Invalid room ID" });
    return;
  }

  const room = await prismaClient.room.findUnique({
    where: { id: roomId },
  });

  res.json({ room });
});

app.delete("/room/:roomId", middleware, async (req, res) => {
  const roomId = Number(req.params.roomId);
  const userId = req.userId;

  if (isNaN(roomId)) {
    res.status(400).json({ message: "Invalid room ID" });
    return;
  }

  try {
    const room = await prismaClient.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    if (room.adminId !== userId) {
      res.status(403).json({ message: "Unauthorized to delete this room" });
      return;
    }

    // Delete associated chats first due to foreign key constraints
    await prismaClient.chat.deleteMany({
      where: { roomId: roomId },
    });

    await prismaClient.room.delete({
      where: { id: roomId },
    });

    res.json({ message: "Room deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to delete room" });
  }
});

app.get("/getUser", middleware, async (req, res) => {
  const userId = req.userId;

  const user = await prismaClient.user.findFirst({
    where: {
      id: userId,
    },
  });

  res.json({
    user,
  });
});

app.listen(process.env.PORT || 3001);
