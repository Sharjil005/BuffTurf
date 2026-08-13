import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  userId: number;
  role: 'USER' | 'TURF_OWNER' | 'ADMIN';
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}