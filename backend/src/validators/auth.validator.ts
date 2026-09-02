import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
    email: z.string().email('Invalid email address').max(254, 'Email is too long'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password is too long'),
    // V1: phone must be digits/spaces/dashes/parens/+, 7–15 chars if provided
    phone: z
      .string()
      .regex(/^[+\d][\d\s\-().]{6,19}$/, 'Invalid phone number format')
      .optional(),
    role: z.enum(['USER', 'TURF_OWNER']).default('USER'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').max(254),
    password: z.string().min(1, 'Password is required').max(128),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];