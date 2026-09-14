import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    bookingId: z.coerce.number().int(),
    rating: z.coerce.number().int().min(1).max(5),
    // comment is optional; empty string is sanitized to undefined
    comment: z
      .string()
      .max(500, 'Comment is too long')
      .optional()
      .or(z.literal(''))
      .transform((val) => (val && val.trim().length > 0 ? val.trim() : undefined)),
  }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>['body'];