import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

declare global {
    namespace Express {
      interface Request {
        userId?: string;
      }
    }
}

export const middleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];

    if(!token) {
        res.json({
            message: "Token couldn`t be obtained"
        })
        return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; 

    if(!decoded) {
        res.json({
            message: "Unauthorized Ascess"
        })
    }

    req.userId = decoded.userId;
    next();
}