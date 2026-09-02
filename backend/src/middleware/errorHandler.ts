import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    // E1: In production, never leak internal error messages (e.g. Prisma stack traces).
    // Only expose raw message in development for easier debugging.
    message = env.NODE_ENV !== 'production' ? err.message : 'Something went wrong, please try again';
  }

  if (env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}