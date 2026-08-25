import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    turfId: z.coerce.number().int(),
    timeSlotId: z.coerce.number().int(),
    sportId: z.coerce.number().int(),
    bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format'),
  }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>['body'];