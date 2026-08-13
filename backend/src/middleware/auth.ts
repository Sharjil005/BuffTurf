import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function protect(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return next(new ApiError(401, 'You must be logged in to access this resource'));
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired session, please log in again'));
  }
}

export function authorize(...roles: JwtPayload['role'][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }
    next();
  };
}