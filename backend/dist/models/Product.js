"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../types");
const productSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: types_1.PRODUCT_TYPES,
        required: true
    },
    accessoryCategory: String,
    name: { type: String, required: true },
    brand: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    discountType: { type: String, enum: ['percent', 'fixed'] },
    discountValue: { type: Number, min: 0 },
    salePrice: { type: Number, required: true, min: 0 },
    stockQty: { type: Number, required: true, default: 0, min: 0 },
    images: [{ type: String }],
    shortDesc: String,
    longDesc: String,
    tags: [String],
    status: {
        type: String,
        enum: ['active', 'draft', 'outOfStock'],
        default: 'active'
    },
    salesCount: { type: Number, default: 0, min: 0 },
    specs: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    createdAt: { type: Date, default: Date.now },
});
// Indexes for filtering and sorting
productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ type: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ salesCount: -1 });
productSchema.index({ 'specs.width': 1 });
productSchema.index({ 'specs.profile': 1 });
productSchema.index({ 'specs.rim': 1 });
productSchema.index({ status: 1 });
const Product = mongoose_1.default.models.Product || mongoose_1.default.model('Product', productSchema);
exports.default = Product;
