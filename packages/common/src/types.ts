import { z } from "zod";

export const CreateUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Email must be at least 3 characters long" })
    .max(100, { message: "Email must be at most 100 characters long" })
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" }),
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be at most 50 characters long" }),
});

export const SigninSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Email must be at least 3 characters long" })
    .max(100, { message: "Email must be at most 100 characters long" })
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" }),
});

export const CreateRoomSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Room name must be between 3 and 20 characters" })
    .max(20, { message: "Room name must be between 3 and 20 characters" }),
});

