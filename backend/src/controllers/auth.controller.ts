import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import { env } from '../config/env';
import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';
import * as userService from '../services/user.service';

const COOKIE_NAME = 'token';

function setAuthCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

function sanitizeUser(user: {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
}) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone };
}

export async function register(req: Request, res: Response) {
  const { user, token } = await registerUser(req.body);
  setAuthCookie(res, token);
  res.status(201).json({ success: true, user: sanitizeUser(user) });
}

export async function login(req: Request, res: Response) {
  const { user, token } = await loginUser(req.body);
  setAuthCookie(res, token);
  res.json({ success: true, user: sanitizeUser(user) });
}

export function logout(req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true, message: 'Logged out' });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, user: sanitizeUser(user) });
}

export async function updateProfile(req: Request, res: Response) {
  const user = await userService.updateProfile(req.user!.userId, req.body);
  res.json({ success: true, user: sanitizeUser(user) });
}