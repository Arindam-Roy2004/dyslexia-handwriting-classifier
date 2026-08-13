import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error.js";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "MulterError") {
    statusCode = 400;
    message = `File upload error: ${err.message}`;
  } else if (err.message) {
    message = err.message;
  }

  if (process.env.NODE_ENV !== "production" && statusCode === 500) {
    console.error("[ServerError]", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

export default errorHandler;
