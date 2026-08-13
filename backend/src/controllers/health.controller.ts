import { Request, Response } from 'express';
import { prisma } from '../config/db';

export async function healthCheck(req: Request, res: Response) {
  const userCount = await prisma.user.count();

  res.json({
    success: true,
    message: 'BuffTurf API is running',
    database: 'connected',
    userCount,
  });
}