import { z } from 'zod';

export const payBookingSchema = z.object({
  body: z.object({
    method: z.enum(['MOCK']).default('MOCK'),
  }),
});