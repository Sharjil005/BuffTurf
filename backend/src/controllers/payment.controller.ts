import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service';

export async function payForBooking(req: Request, res: Response) {
  const result = await paymentService.payForBooking(Number(req.params.id), req.user!.userId);
  res.json({ success: true, ...result });
}