import { z } from 'zod';

export const createComplaintSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters long').max(150),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  turfId: z.number().optional(),
});

export const updateComplaintStatusSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']),
});

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;
export type UpdateComplaintStatusInput = z.infer<typeof updateComplaintStatusSchema>;
