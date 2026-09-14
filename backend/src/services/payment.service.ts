import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';
import { RazorpayMockProvider } from './providers/RazorpayMockProvider';
import { createNotification } from './notification.service';

const razorpay = new RazorpayMockProvider();

// ─── Phase 1: Create Order ────────────────────────────────────────────────────

export async function createRazorpayOrder(bookingId: number, userId: number) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true, turf: true },
  });

  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.userId !== userId) throw new ApiError(403, 'Forbidden');
  if (booking.status === 'CANCELLED') throw new ApiError(400, 'Cannot pay for a cancelled booking');
  if (booking.status === 'COMPLETED') throw new ApiError(400, 'Cannot pay for a completed booking');
  if (booking.payment && booking.payment.status === 'SUCCESS') {
    throw new ApiError(400, 'This booking has already been paid for');
  }

  const order = razorpay.createOrder(Number(booking.totalPrice), bookingId);

  // Persist a PENDING payment record so we can match it on verify
  await prisma.payment.upsert({
    where: { bookingId },
    create: {
      bookingId,
      amount: booking.totalPrice,
      method: 'ONLINE_GATEWAY',
      status: 'PENDING',
      transactionRef: order.orderId,
    },
    update: {
      status: 'PENDING',
      transactionRef: order.orderId,
    },
  });

  return order;
}

// ─── Phase 2: Verify Payment ──────────────────────────────────────────────────

export async function verifyRazorpayPayment(
  bookingId: number,
  userId: number,
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true, turf: true },
  });

  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.userId !== userId) throw new ApiError(403, 'Forbidden');
  if (!booking.payment) throw new ApiError(400, 'No payment order found — create an order first');

  const isValid = razorpay.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

  if (!isValid) {
    // Mark payment as failed
    await prisma.payment.update({
      where: { bookingId },
      data: { status: 'FAILED', transactionRef: razorpay_payment_id },
    });
    throw new ApiError(400, 'Payment signature verification failed. Please try again.');
  }

  // Confirm payment and booking
  const [payment] = await prisma.$transaction([
    prisma.payment.update({
      where: { bookingId },
      data: { status: 'SUCCESS', transactionRef: razorpay_payment_id },
    }),
    prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
    }),
  ]);

  // Notify user and turf owner
  await createNotification(
    userId,
    'BOOKING_CONFIRMED',
    `Payment of ₹${booking.totalPrice} successful! Booking #${bookingId} for ${booking.turf.name} is confirmed.`,
  );
  await createNotification(
    booking.turf.ownerId,
    'BOOKING_CONFIRMED',
    `Payment confirmed for booking #${bookingId} at ${booking.turf.name}.`,
  );

  return { payment, bookingStatus: 'CONFIRMED' as const };
}

// ─── Legacy: Direct Pay (kept for backward compat) ───────────────────────────

export async function payForBooking(bookingId: number, userId: number) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true, turf: true },
  });

  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.userId !== userId) throw new ApiError(403, 'You do not have permission to pay for this booking');
  if (booking.status === 'CANCELLED') throw new ApiError(400, 'Cannot pay for a cancelled booking');
  if (booking.status === 'COMPLETED') throw new ApiError(400, 'Cannot pay for a completed booking');
  if (booking.payment && booking.payment.status !== 'FAILED') {
    throw new ApiError(400, 'This booking has already been paid for');
  }

  const result = await razorpay.charge(Number(booking.totalPrice), { bookingId });

  const payment = await prisma.payment.upsert({
    where: { bookingId },
    create: {
      bookingId,
      amount: booking.totalPrice,
      method: 'ONLINE_GATEWAY',
      status: result.status,
      transactionRef: result.transactionRef,
    },
    update: { status: result.status, transactionRef: result.transactionRef },
  });

  if (result.status === 'SUCCESS') {
    await prisma.booking.update({ where: { id: bookingId }, data: { status: 'CONFIRMED' } });
    await createNotification(
      userId,
      'BOOKING_CONFIRMED',
      `Payment of ₹${booking.totalPrice} successful! Booking #${bookingId} for ${booking.turf.name} is confirmed.`,
    );
    await createNotification(
      booking.turf.ownerId,
      'BOOKING_CONFIRMED',
      `Payment confirmed for booking #${bookingId} at ${booking.turf.name}.`,
    );
  }

  return { payment, bookingStatus: result.status === 'SUCCESS' ? 'CONFIRMED' : booking.status };
}