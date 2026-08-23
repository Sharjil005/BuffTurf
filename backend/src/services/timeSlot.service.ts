import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';
import { assertOwnership } from './turf.service';
import type { CreateTimeSlotInput, UpdateTimeSlotInput } from '../validators/timeSlot.validator';

export async function createTimeSlot(
  turfId: number,
  userId: number,
  role: string,
  input: CreateTimeSlotInput
) {
  await assertOwnership(turfId, userId, role);

  const overlapping = await prisma.timeSlot.findFirst({
    where: {
      turfId,
      dayOfWeek: input.dayOfWeek,
      isActive: true,
      OR: [
        { startTime: { lt: input.endTime }, endTime: { gt: input.startTime } },
      ],
    },
  });

  if (overlapping) {
    throw new ApiError(409, 'This time slot overlaps with an existing slot on that day');
  }

  return prisma.timeSlot.create({
    data: { turfId, ...input },
  });
}

export async function getTurfSlots(turfId: number) {
  return prisma.timeSlot.findMany({
    where: { turfId },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  });
}

export async function updateTimeSlot(
  turfId: number,
  slotId: number,
  userId: number,
  role: string,
  input: UpdateTimeSlotInput
) {
  await assertOwnership(turfId, userId, role);

  const slot = await prisma.timeSlot.findUnique({ where: { id: slotId } });
  if (!slot || slot.turfId !== turfId) {
    throw new ApiError(404, 'Time slot not found');
  }

  return prisma.timeSlot.update({
    where: { id: slotId },
    data: input,
  });
}

export async function deleteTimeSlot(
  turfId: number,
  slotId: number,
  userId: number,
  role: string
) {
  await assertOwnership(turfId, userId, role);

  const slot = await prisma.timeSlot.findUnique({ where: { id: slotId } });
  if (!slot || slot.turfId !== turfId) {
    throw new ApiError(404, 'Time slot not found');
  }

  await prisma.timeSlot.delete({ where: { id: slotId } });
}