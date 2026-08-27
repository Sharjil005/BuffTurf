import { prisma } from '../config/db';
import type { UpdateProfileInput } from '../validators/user.validator';

export async function updateProfile(userId: number, input: UpdateProfileInput) {
  return prisma.user.update({
    where: { id: userId },
    data: input,
  });
}