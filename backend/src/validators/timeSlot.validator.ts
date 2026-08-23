import { z } from 'zod';

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createTimeSlotSchema = z.object({
  body: z.object({
    dayOfWeek: z.coerce.number().int().min(0).max(6),
    startTime: z.string().regex(timePattern, 'Use HH:MM format, e.g. 06:00'),
    endTime: z.string().regex(timePattern, 'Use HH:MM format, e.g. 07:00'),
    price: z.coerce.number().positive('Price must be greater than 0'),
  }).refine((data) => data.startTime < data.endTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  }),
});

export const updateTimeSlotSchema = z.object({
  body: z.object({
    startTime: z.string().regex(timePattern).optional(),
    endTime: z.string().regex(timePattern).optional(),
    price: z.coerce.number().positive().optional(),
    isActive: z.boolean().optional(),
  }),
});

export type CreateTimeSlotInput = z.infer<typeof createTimeSlotSchema>['body'];
export type UpdateTimeSlotInput = z.infer<typeof updateTimeSlotSchema>['body'];