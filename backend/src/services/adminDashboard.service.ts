import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';

export async function getPlatformStats() {
  const [totalUsers, totalTurfs, totalBookings, pendingTurfs, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.turf.count(),
    prisma.booking.count({ where: { status: { not: 'CANCELLED' } } }),
    prisma.turf.count({ where: { status: 'PENDING' } }),
    prisma.payment.aggregate({ where: { status: 'SUCCESS' }, _sum: { amount: true } }),
  ]);

  return {
    totalUsers,
    totalTurfs,
    totalBookings,
    pendingTurfs,
    totalRevenue: Number(totalRevenue._sum.amount ?? 0),
  };
}

export async function getAllUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateUserRole(userId: number, role: 'USER' | 'TURF_OWNER' | 'ADMIN') {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, 'User not found');
  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });
}

export async function getAllTurfs() {
  return prisma.turf.findMany({
    include: { owner: { select: { name: true, email: true } }, turfSports: { include: { sport: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateTurfStatus(turfId: number, status: 'APPROVED' | 'REJECTED') {
  const turf = await prisma.turf.findUnique({ where: { id: turfId } });
  if (!turf) throw new ApiError(404, 'Turf not found');
  return prisma.turf.update({ where: { id: turfId }, data: { status } });
}

export async function getAllBookings() {
  return prisma.booking.findMany({
    include: {
      user: { select: { name: true, email: true } },
      turf: { select: { name: true } },
      sport: true,
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}