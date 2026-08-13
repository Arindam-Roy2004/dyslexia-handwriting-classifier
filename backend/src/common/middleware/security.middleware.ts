import { Request, Response, NextFunction } from "express";

export const sanitizeBody = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === "object") {
    // Basic body key-trimming to prevent prototype pollution
    for (const key of Object.keys(req.body)) {
      if (key.includes("__proto__") || key.includes("constructor")) {
        delete req.body[key];
      }
    }
  }
  next();
};

export default sanitizeBody;
