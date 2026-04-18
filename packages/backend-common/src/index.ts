import dotenv from "dotenv";
import path from "path";

// Resolving from process.cwd() since ESM/__dirname conflicts exist between tsc and Node
// Assuming the caller is apps/http-backend or apps/ws-backend, process.cwd() is that folder.
// The root .env is two directories up from those application folders.
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

// JWT_SECRET must be explicitly set as an environment variable.
// We intentionally do NOT provide a fallback — if it's missing, we fail fast
// at startup rather than silently using an insecure default that anyone can guess.
if (!process.env.JWT_SECRET) {
  throw new Error(
    "FATAL: JWT_SECRET environment variable is not set. " +
    "Set it in your .env file locally or in the Render dashboard for production."
  );
}

export const JWT_SECRET = process.env.JWT_SECRET;