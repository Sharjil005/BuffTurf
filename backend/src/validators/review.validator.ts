import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    bookingId: z.coerce.number().int(),
    rating: z.coerce.number().int().min(1).max(5),
    // V3: comment is optional but must not be an empty string if supplied
    comment: z.string().min(1, 'Comment cannot be empty').max(500).optional(),
  }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>['body'];