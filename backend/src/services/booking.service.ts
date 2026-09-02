import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';
import type { CreateBookingInput } from '../validators/booking.validator';
import { createNotification } from './notification.service';

export async function createBooking(userId: number, input: CreateBookingInput) {
  const { turfId, timeSlotId, sportId, bookingDate } = input;

  const slot = await prisma.timeSlot.findUnique({ where: { id: timeSlotId } });
  if (!slot || slot.turfId !== turfId) {
    throw new ApiError(404, 'Time slot not found for this turf');
  }
  if (!slot.isActive) {
    throw new ApiError(400, 'This slot is not currently available');
  }

  // B2: Ensure only APPROVED turfs can be booked
  const turf = await prisma.turf.findUnique({ where: { id: turfId } });
  if (!turf) {
    throw new ApiError(404, 'Turf not found');
  }
  if (turf.status !== 'APPROVED') {
    throw new ApiError(400, 'This turf is not currently accepting bookings');
  }

  const sport = await prisma.sport.findUnique({ where: { id: sportId } });
  if (!sport) {
    throw new ApiError(404, 'Sport not found');
  }

  const dateObj = new Date(`${bookingDate}T00:00:00Z`);
  if (isNaN(dateObj.getTime())) {
    throw new ApiError(400, 'Invalid booking date');
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (dateObj < today) {
    throw new ApiError(400, 'Cannot book a date in the past');
  }

  if (dateObj.getUTCDay() !== slot.dayOfWeek) {
    throw new ApiError(400, "Selected date does not fall on this slot's day of the week");
  }

  // L2 — KNOWN LIMITATION (design decision, not a bug):
  // PENDING bookings (not yet paid) hold the slot via activeKey. If a user abandons
  // payment, the slot remains locked until the booking is explicitly cancelled.
  // No TTL / auto-expire mechanism exists. In production, implement a background
  // job that expires PENDING bookings after e.g. 15 minutes.

  const activeKey = `${timeSlotId}#${bookingDate}`;

  try {
    const booking = await prisma.booking.create({
      data: {
        userId,
        turfId,
        timeSlotId,
        sportId,
        bookingDate: dateObj,
        totalPrice: slot.price,
        status: 'PENDING',
        activeKey,
      },
      include: { turf: true, timeSlot: true, sport: true },
    });

    // Notify user & turf owner
    await createNotification(
      userId,
      'BOOKING_CREATED',
      `Booking request submitted for ${booking.turf.name} on ${bookingDate}.`
    );
    await createNotification(
      booking.turf.ownerId,
      'BOOKING_CREATED',
      `New booking request received for ${booking.turf.name} on ${bookingDate}.`
    );

    return booking;
  } catch (err: any) {
    if (err.code === 'P2002') {
      throw new ApiError(409, 'This slot has already been booked for the selected date');
    }
    throw err;
  }
}

export async function getMyBookings(userId: number) {
  return prisma.booking.findMany({
    where: { userId },
    include: { turf: true, timeSlot: true, sport: true, payment: true },
    orderBy: { bookingDate: 'desc' },
  });
}

export async function getBookingById(bookingId: number, userId: number, role: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { turf: true, timeSlot: true, sport: true, payment: true },
  });
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.userId !== userId && role !== 'ADMIN') {
    throw new ApiError(403, 'You do not have permission to view this booking');
  }
  return booking;
}

export async function cancelBooking(bookingId: number, userId: number, role: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { turf: true },
  });
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.userId !== userId && role !== 'ADMIN') {
    throw new ApiError(403, 'You do not have permission to cancel this booking');
  }
  if (booking.status === 'CANCELLED') {
    throw new ApiError(400, 'This booking is already cancelled');
  }
  if (booking.status === 'COMPLETED') {
    throw new ApiError(400, 'Cannot cancel a completed booking');
  }
  // L1 — KNOWN LIMITATION (design decision, not a bug):
  // A CONFIRMED (paid) booking can be cancelled here. The payment record stays at
  // SUCCESS but the booking moves to CANCELLED and activeKey is nulled (freeing the slot).
  // No refund logic exists because this is a mock payment system. In production,
  // either (a) only admins should be able to cancel paid bookings, or (b) a refund
  // flow must be triggered before setting the booking to CANCELLED.

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED', activeKey: null },
  });

  // Notify user & owner
  await createNotification(
    booking.userId,
    'BOOKING_CANCELLED',
    `Booking #${bookingId} for ${booking.turf.name} has been cancelled.`
  );
  await createNotification(
    booking.turf.ownerId,
    'BOOKING_CANCELLED',
    `Booking #${bookingId} for ${booking.turf.name} was cancelled.`
  );

  return updatedBooking;
}