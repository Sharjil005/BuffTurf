import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';

export async function addFavorite(userId: number, turfId: number) {
  const turf = await prisma.turf.findUnique({ where: { id: turfId } });
  if (!turf) throw new ApiError(404, 'Turf not found');

  return prisma.favorite.upsert({
    where: { userId_turfId: { userId, turfId } },
    create: { userId, turfId },
    update: {},
  });
}

export async function removeFavorite(userId: number, turfId: number) {
  await prisma.favorite.deleteMany({ where: { userId, turfId } });
}

export async function getMyFavorites(userId: number) {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      turf: {
        include: { images: true, turfSports: { include: { sport: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return favorites.map((f) => f.turf);
}