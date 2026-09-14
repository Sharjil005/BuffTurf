import { z } from 'zod';

export const payBookingSchema = z.object({
  body: z.object({
    method: z.enum(['MOCK', 'ONLINE_GATEWAY']).default('ONLINE_GATEWAY'),
  }),
});

export const verifyRazorpaySchema = z.object({
  body: z.object({
    razorpay_order_id: z.string().min(1, 'Order ID is required'),
    razorpay_payment_id: z.string().min(1, 'Payment ID is required'),
    razorpay_signature: z.string().min(1, 'Signature is required'),
  }),
});