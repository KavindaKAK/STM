import { z } from 'zod';
import { SRI_LANKA_DISTRICTS, PAYMENT_METHODS } from '@/types';

export const addressSchema = z.object({
    label: z.string().min(1, 'Label is required'),
    line1: z.string().min(1, 'Address line 1 is required'),
    line2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    district: z.enum(SRI_LANKA_DISTRICTS as any),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().default('Sri Lanka'),
    isDefault: z.boolean().default(false),
});

export const checkoutSchema = z.object({
    shippingAddress: addressSchema,
    district: z.enum(SRI_LANKA_DISTRICTS as any),
    paymentMethod: z.enum(PAYMENT_METHODS as any).default('cod'),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
