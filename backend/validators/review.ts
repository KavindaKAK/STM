import { z } from 'zod';

export const reviewSchema = z.object({
    productId: z.string().optional(),
    rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
    comment: z.string().min(10, 'Comment must be at least 10 characters'),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
