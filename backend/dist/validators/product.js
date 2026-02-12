"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = exports.accessorySpecsSchema = exports.batterySpecsSchema = exports.tyreSpecsSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("@/types");
exports.tyreSpecsSchema = zod_1.z.object({
    sizeText: zod_1.z.string(),
    width: zod_1.z.string(),
    profile: zod_1.z.string(),
    rim: zod_1.z.string(),
    speedRating: zod_1.z.string().optional(),
    loadIndex: zod_1.z.string().optional(),
    pattern: zod_1.z.string().optional(),
    vehicleType: zod_1.z.string().optional(),
});
exports.batterySpecsSchema = zod_1.z.object({
    voltage: zod_1.z.string().optional(),
    ah: zod_1.z.string().optional(),
    cca: zod_1.z.string().optional(),
    batteryType: zod_1.z.string().optional(),
});
exports.accessorySpecsSchema = zod_1.z.object({
    fitment: zod_1.z.string().optional(),
});
exports.productSchema = zod_1.z.object({
    type: zod_1.z.enum(types_1.PRODUCT_TYPES),
    accessoryCategory: zod_1.z.string().optional(),
    name: zod_1.z.string().min(1, 'Name is required'),
    brand: zod_1.z.string().min(1, 'Brand is required'),
    sku: zod_1.z.string().min(1, 'SKU is required'),
    price: zod_1.z.number().min(0, 'Price must be positive'),
    discountType: zod_1.z.enum(['percent', 'fixed']).optional(),
    discountValue: zod_1.z.number().min(0).optional(),
    salePrice: zod_1.z.number().min(0),
    stockQty: zod_1.z.number().int().min(0, 'Stock quantity must be non-negative'),
    images: zod_1.z.array(zod_1.z.string()).default([]),
    shortDesc: zod_1.z.string().optional(),
    longDesc: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    status: zod_1.z.enum(['active', 'draft', 'outOfStock']).default('active'),
    specs: zod_1.z.union([exports.tyreSpecsSchema, exports.batterySpecsSchema, exports.accessorySpecsSchema]).optional(),
});
