import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    bookingId: z.coerce.number().int(),
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().max(500).optional(),
  }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>['body'];