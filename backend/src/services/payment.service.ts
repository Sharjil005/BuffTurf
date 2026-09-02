import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';
import { MockPaymentProvider } from './providers/MockPaymentProvider';
import type { PaymentProvider } from './providers/PaymentProvider';
import { createNotification } from './notification.service';

const provider: PaymentProvider = new MockPaymentProvider();

export async function payForBooking(bookingId: number, userId: number) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true, turf: true },
  });

  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.userId !== userId) {
    throw new ApiError(403, 'You do not have permission to pay for this booking');
  }
  if (booking.status === 'CANCELLED') {
    throw new ApiError(400, 'Cannot pay for a cancelled booking');
  }
  if (booking.status === 'COMPLETED') {
    throw new ApiError(400, 'Cannot pay for a completed booking');
  }
  // B3: Block re-processing unless the previous attempt explicitly FAILED
  if (booking.payment && booking.payment.status !== 'FAILED') {
    throw new ApiError(400, 'This booking has already been paid for');
  }

  const result = await provider.charge(Number(booking.totalPrice), { bookingId });

  const payment = await prisma.payment.upsert({
    where: { bookingId },
    create: {
      bookingId,
      amount: booking.totalPrice,
      method: 'MOCK',
      status: result.status,
      transactionRef: result.transactionRef,
    },
    update: {
      status: result.status,
      transactionRef: result.transactionRef,
    },
  });

  if (result.status === 'SUCCESS') {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
    });

    await createNotification(
      userId,
      'BOOKING_CONFIRMED',
      `Payment of ₹${booking.totalPrice} successful! Booking #${bookingId} for ${booking.turf.name} is confirmed.`
    );

    await createNotification(
      booking.turf.ownerId,
      'BOOKING_CONFIRMED',
      `Payment confirmed for booking #${bookingId} at ${booking.turf.name}.`
    );
  }

  return { payment, bookingStatus: result.status === 'SUCCESS' ? 'CONFIRMED' : booking.status };
}