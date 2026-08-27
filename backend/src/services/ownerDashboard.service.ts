import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';

export async function getDashboardStats(ownerId: number) {
  const turfs = await prisma.turf.findMany({ where: { ownerId }, select: { id: true } });
  const turfIds = turfs.map((t) => t.id);

  if (turfIds.length === 0) {
    return { totalBookings: 0, todayBookings: 0, totalRevenue: 0, popularSports: [], recentBookings: [] };
  }

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

  const [totalBookings, todayBookings, payments, sportGroups, recentBookings] = await Promise.all([
    prisma.booking.count({ where: { turfId: { in: turfIds }, status: { not: 'CANCELLED' } } }),
    prisma.booking.count({
      where: {
        turfId: { in: turfIds },
        status: { not: 'CANCELLED' },
        bookingDate: { gte: todayStart, lt: todayEnd },
      },
    }),
    prisma.payment.findMany({
      where: { booking: { turfId: { in: turfIds } }, status: 'SUCCESS' },
      select: { amount: true },
    }),
    prisma.booking.groupBy({
      by: ['sportId'],
      where: { turfId: { in: turfIds }, status: { not: 'CANCELLED' } },
      _count: { sportId: true },
    }),
    prisma.booking.findMany({
      where: { turfId: { in: turfIds } },
      include: { turf: true, sport: true, user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  const sportIds = sportGroups.map((g) => g.sportId);
  const sports = await prisma.sport.findMany({ where: { id: { in: sportIds } } });
  const popularSports = sportGroups
    .map((g) => ({
      sport: sports.find((s) => s.id === g.sportId)?.name ?? 'Unknown',
      count: g._count.sportId,
    }))
    .sort((a, b) => b.count - a.count);

  return { totalBookings, todayBookings, totalRevenue, popularSports, recentBookings };
}

export async function getOwnerBookings(ownerId: number) {
  const turfs = await prisma.turf.findMany({ where: { ownerId }, select: { id: true } });
  const turfIds = turfs.map((t) => t.id);

  return prisma.booking.findMany({
    where: { turfId: { in: turfIds } },
    include: {
      turf: true,
      timeSlot: true,
      sport: true,
      user: { select: { id: true, name: true, email: true } },
      payment: true,
    },
    orderBy: { bookingDate: 'desc' },
  });
}

export async function markBookingCompleted(bookingId: number, ownerId: number) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { turf: true } });
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.turf.ownerId !== ownerId) {
    throw new ApiError(403, 'You do not have permission to modify this booking');
  }
  if (booking.status !== 'CONFIRMED') {
    throw new ApiError(400, 'Only confirmed bookings can be marked as completed');
  }

  return prisma.booking.update({ where: { id: bookingId }, data: { status: 'COMPLETED' } });
}