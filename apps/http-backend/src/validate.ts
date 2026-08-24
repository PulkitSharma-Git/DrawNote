import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: result.error.errors[0]?.message || "Incorrect inputs",
        errors: result.error.errors,
      });
      return;
    }
    // Replace req.body with parsed/validated data
    req.body = result.data;
    next();
  };
};
