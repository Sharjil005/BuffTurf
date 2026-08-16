import { z } from 'zod';

export const createTurfSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().optional(),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    sportIds: z.array(z.coerce.number()).min(1, 'Select at least one sport'),
    facilityIds: z.array(z.coerce.number()).optional().default([]),
  }),
});

export const updateTurfSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    address: z.string().min(5).optional(),
    city: z.string().min(2).optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    sportIds: z.array(z.coerce.number()).optional(),
    facilityIds: z.array(z.coerce.number()).optional(),
  }),
});

export type CreateTurfInput = z.infer<typeof createTurfSchema>['body'];
export type UpdateTurfInput = z.infer<typeof updateTurfSchema>['body'];