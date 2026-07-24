import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

// Extend Express's Request type to carry the authenticated userId
// after the middleware verifies the JWT.
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  // Reject immediately if no Authorization header was provided at all.
  if (!authHeader) {
    res.status(401).json({ message: "No token provided." });
    return;
  }

  // Support both plain token and "Bearer <token>" format.
  // The frontend currently sends a plain token, but this makes the middleware
  // compatible with standard Authorization: Bearer usage as well.
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  // Wrap jwt.verify in try/catch — it throws (not returns) on invalid tokens.
  // Without this, a bad token would produce an unhandled exception that crashes
  // the request entirely instead of returning a clean 401.
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded || !decoded.userId) {
      res.status(401).json({ message: "Invalid token payload." });
      return;
    }

    // Attach the authenticated user ID to the request for downstream handlers.
    req.userId = decoded.userId;
    next();
  } catch (err) {
    // This catches: jwt malformed, jwt expired, invalid signature, etc.
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
