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

export const getTurfsQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    city: z.string().optional(),
    sportId: z.coerce.number().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    minRating: z.coerce.number().min(0).max(5).optional(),
    sortBy: z.enum(['price_asc', 'price_desc', 'rating', 'popularity']).optional(),
    page: z.coerce.number().min(1).optional().default(1),
    limit: z.coerce.number().min(1).max(50).optional().default(12),
  }),
});

export type CreateTurfInput = z.infer<typeof createTurfSchema>['body'];
export type UpdateTurfInput = z.infer<typeof updateTurfSchema>['body'];
export type GetTurfsQuery = z.infer<typeof getTurfsQuerySchema>['query'];