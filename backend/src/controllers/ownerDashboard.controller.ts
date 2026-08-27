import { Request, Response } from 'express';
import * as ownerService from '../services/ownerDashboard.service';

export async function getDashboardStats(req: Request, res: Response) {
  const stats = await ownerService.getDashboardStats(req.user!.userId);
  res.json({ success: true, stats });
}

export async function getOwnerBookings(req: Request, res: Response) {
  const bookings = await ownerService.getOwnerBookings(req.user!.userId);
  res.json({ success: true, bookings });
}

export async function markBookingCompleted(req: Request, res: Response) {
  const booking = await ownerService.markBookingCompleted(Number(req.params.id), req.user!.userId);
  res.json({ success: true, booking });
}