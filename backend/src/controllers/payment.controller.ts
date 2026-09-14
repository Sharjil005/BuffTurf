import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service';

/** POST /bookings/:id/pay — legacy direct payment */
export async function payForBooking(req: Request, res: Response) {
  const result = await paymentService.payForBooking(Number(req.params.id), req.user!.userId);
  res.json({ success: true, ...result });
}

/** POST /bookings/:id/razorpay-order — Phase 1: create Razorpay mock order */
export async function createRazorpayOrder(req: Request, res: Response) {
  const order = await paymentService.createRazorpayOrder(Number(req.params.id), req.user!.userId);
  res.json({ success: true, order });
}

/** POST /bookings/:id/razorpay-verify — Phase 2: verify Razorpay mock payment */
export async function verifyRazorpayPayment(req: Request, res: Response) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const result = await paymentService.verifyRazorpayPayment(
    Number(req.params.id),
    req.user!.userId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  );
  res.json({ success: true, ...result });
}