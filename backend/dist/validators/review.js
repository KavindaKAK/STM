"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
const zod_1 = require("zod");
exports.reviewSchema = zod_1.z.object({
    productId: zod_1.z.string().optional(),
    rating: zod_1.z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
    comment: zod_1.z.string().min(10, 'Comment must be at least 10 characters'),
});
