import { Request, Response } from 'express';
import * as bookingService from '../services/booking.service';

export async function createBooking(req: Request, res: Response) {
  const booking = await bookingService.createBooking(req.user!.userId, req.body);
  res.status(201).json({ success: true, booking });
}

export async function getMyBookings(req: Request, res: Response) {
  const bookings = await bookingService.getMyBookings(req.user!.userId);
  res.json({ success: true, bookings });
}

export async function getBooking(req: Request, res: Response) {
  const booking = await bookingService.getBookingById(
    Number(req.params.id),
    req.user!.userId,
    req.user!.role
  );
  res.json({ success: true, booking });
}

export async function cancelBooking(req: Request, res: Response) {
  const booking = await bookingService.cancelBooking(
    Number(req.params.id),
    req.user!.userId,
    req.user!.role
  );
  res.json({ success: true, booking });
}