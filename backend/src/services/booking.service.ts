import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';
import type { CreateBookingInput } from '../validators/booking.validator';

export async function createBooking(userId: number, input: CreateBookingInput) {
  const { turfId, timeSlotId, sportId, bookingDate } = input;

  const slot = await prisma.timeSlot.findUnique({ where: { id: timeSlotId } });
  if (!slot || slot.turfId !== turfId) {
    throw new ApiError(404, 'Time slot not found for this turf');
  }
  if (!slot.isActive) {
    throw new ApiError(400, 'This slot is not currently available');
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

  const activeKey = `${timeSlotId}#${bookingDate}`;

  try {
    return await prisma.booking.create({
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
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
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

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED', activeKey: null },
  });
}