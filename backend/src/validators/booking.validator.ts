import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    turfId: z.coerce.number().int(),
    timeSlotId: z.coerce.number().int(),
    sportId: z.coerce.number().int(),
    // V2: regex ensures format, refine() ensures it's a real calendar date (rejects month 13, day 32, etc.)
    bookingDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format')
      .refine((val) => {
        const d = new Date(`${val}T00:00:00Z`);
        return !isNaN(d.getTime()) && d.toISOString().startsWith(val);
      }, 'Invalid calendar date'),
  }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>['body'];