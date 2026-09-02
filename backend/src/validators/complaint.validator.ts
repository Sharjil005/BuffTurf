import { z } from 'zod';

// NOTE: createComplaintSchema MUST be wrapped in z.object({ body: ... })
// so that the validate() middleware (which parses { body, query, params }) works correctly.
export const createComplaintSchema = z.object({
  body: z.object({
    subject: z.string().min(3, 'Subject must be at least 3 characters long').max(150),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    turfId: z.coerce.number().int().optional(),
  }),
});

export const updateComplaintStatusSchema = z.object({
  body: z.object({
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']),
  }),
});

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>['body'];
export type UpdateComplaintStatusInput = z.infer<typeof updateComplaintStatusSchema>['body'];
