import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';
import type { CreateTurfInput, UpdateTurfInput } from '../validators/turf.validator';

const turfInclude = {
  images: true,
  turfSports: { include: { sport: true } },
  facilities: { include: { facility: true } },
};

export async function createTurf(ownerId: number, input: CreateTurfInput) {
  return prisma.turf.create({
    data: {
      ownerId,
      name: input.name,
      description: input.description,
      address: input.address,
      city: input.city,
      latitude: input.latitude,
      longitude: input.longitude,
      turfSports: { create: input.sportIds.map((sportId) => ({ sportId })) },
      facilities: { create: (input.facilityIds ?? []).map((facilityId) => ({ facilityId })) },
    },
    include: turfInclude,
  });
}

export async function getMyTurfs(ownerId: number) {
  return prisma.turf.findMany({
    where: { ownerId },
    include: turfInclude,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getTurfById(id: number) {
  const turf = await prisma.turf.findUnique({
    where: { id },
    include: { ...turfInclude, owner: { select: { id: true, name: true, email: true } } },
  });
  if (!turf) throw new ApiError(404, 'Turf not found');
  return turf;
}

async function assertOwnership(turfId: number, userId: number, role: string) {
  const turf = await prisma.turf.findUnique({ where: { id: turfId } });
  if (!turf) throw new ApiError(404, 'Turf not found');
  if (turf.ownerId !== userId && role !== 'ADMIN') {
    throw new ApiError(403, 'You do not have permission to modify this turf');
  }
  return turf;
}

export async function updateTurf(
  turfId: number,
  userId: number,
  role: string,
  input: UpdateTurfInput
) {
  await assertOwnership(turfId, userId, role);

  if (input.sportIds) {
    await prisma.turfSport.deleteMany({ where: { turfId } });
  }
  if (input.facilityIds) {
    await prisma.turfFacility.deleteMany({ where: { turfId } });
  }

  return prisma.turf.update({
    where: { id: turfId },
    data: {
      name: input.name,
      description: input.description,
      address: input.address,
      city: input.city,
      latitude: input.latitude,
      longitude: input.longitude,
      ...(input.sportIds && {
        turfSports: { create: input.sportIds.map((sportId) => ({ sportId })) },
      }),
      ...(input.facilityIds && {
        facilities: { create: input.facilityIds.map((facilityId) => ({ facilityId })) },
      }),
    },
    include: turfInclude,
  });
}

export async function deleteTurf(turfId: number, userId: number, role: string) {
  await assertOwnership(turfId, userId, role);
  await prisma.turf.delete({ where: { id: turfId } });
}

export async function addTurfImage(turfId: number, userId: number, role: string, url: string) {
  await assertOwnership(turfId, userId, role);
  return prisma.turfImage.create({ data: { turfId, url } });
}

export async function deleteTurfImage(
  turfId: number,
  imageId: number,
  userId: number,
  role: string
) {
  await assertOwnership(turfId, userId, role);
  await prisma.turfImage.delete({ where: { id: imageId } });
}