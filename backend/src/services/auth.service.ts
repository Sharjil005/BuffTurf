import bcrypt from 'bcrypt';
import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';
import { signToken } from '../utils/jwt';
import type { RegisterInput, LoginInput } from '../validators/auth.validator';

const SALT_ROUNDS = 12;

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      phone: input.phone,
      role: input.role,
    },
  });

  const token = signToken({ userId: user.id, role: user.role });
  return { user, token };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(input.password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken({ userId: user.id, role: user.role });
  return { user, token };
}