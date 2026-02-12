import { z } from 'zod';
import { PRODUCT_TYPES } from '@/types';

export const tyreSpecsSchema = z.object({
    sizeText: z.string(),
    width: z.string(),
    profile: z.string(),
    rim: z.string(),
    speedRating: z.string().optional(),
    loadIndex: z.string().optional(),
    pattern: z.string().optional(),
    vehicleType: z.string().optional(),
});

export const batterySpecsSchema = z.object({
    voltage: z.string().optional(),
    ah: z.string().optional(),
    cca: z.string().optional(),
    batteryType: z.string().optional(),
});

export const accessorySpecsSchema = z.object({
    fitment: z.string().optional(),
});

export const productSchema = z.object({
    type: z.enum(PRODUCT_TYPES),
    accessoryCategory: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    brand: z.string().min(1, 'Brand is required'),
    sku: z.string().min(1, 'SKU is required'),
    price: z.number().min(0, 'Price must be positive'),
    discountType: z.enum(['percent', 'fixed']).optional(),
    discountValue: z.number().min(0).optional(),
    salePrice: z.number().min(0),
    stockQty: z.number().int().min(0, 'Stock quantity must be non-negative'),
    images: z.array(z.string()).default([]),
    shortDesc: z.string().optional(),
    longDesc: z.string().optional(),
    tags: z.array(z.string()).default([]),
    status: z.enum(['active', 'draft', 'outOfStock']).default('active'),
    specs: z.union([tyreSpecsSchema, batterySpecsSchema, accessorySpecsSchema]).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
