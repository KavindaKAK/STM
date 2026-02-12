"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutSchema = exports.addressSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("@/types");
exports.addressSchema = zod_1.z.object({
    label: zod_1.z.string().min(1, 'Label is required'),
    line1: zod_1.z.string().min(1, 'Address line 1 is required'),
    line2: zod_1.z.string().optional(),
    city: zod_1.z.string().min(1, 'City is required'),
    district: zod_1.z.enum(types_1.SRI_LANKA_DISTRICTS),
    postalCode: zod_1.z.string().min(1, 'Postal code is required'),
    country: zod_1.z.string().default('Sri Lanka'),
    isDefault: zod_1.z.boolean().default(false),
});
exports.checkoutSchema = zod_1.z.object({
    shippingAddress: exports.addressSchema,
    district: zod_1.z.enum(types_1.SRI_LANKA_DISTRICTS),
    paymentMethod: zod_1.z.enum(types_1.PAYMENT_METHODS).default('cod'),
});
