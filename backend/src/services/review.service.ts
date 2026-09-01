import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';
import type { CreateReviewInput } from '../validators/review.validator';

export async function createReview(userId: number, turfId: number, input: CreateReviewInput) {
  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
    include: { review: true },
  });

  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.userId !== userId) throw new ApiError(403, 'This is not your booking');
  if (booking.turfId !== turfId) throw new ApiError(400, 'Booking does not match this turf');
  if (booking.status !== 'COMPLETED') {
    throw new ApiError(400, 'You can only review a turf after completing a booking there');
  }
  if (booking.review) throw new ApiError(409, 'You have already reviewed this booking');

  return prisma.review.create({
    data: { userId, turfId, bookingId: input.bookingId, rating: input.rating, comment: input.comment },
    include: { user: { select: { name: true } } },
  });
}

export async function getTurfReviews(turfId: number) {
  return prisma.review.findMany({
    where: { turfId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
}