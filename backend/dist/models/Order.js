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
const types_1 = require("@/types");
const orderItemSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    nameSnapshot: { type: String, required: true },
    priceSnapshot: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    imageSnapshot: { type: String, required: true },
});
const customerSnapshotSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
});
const shippingAddressSchema = new mongoose_1.Schema({
    line1: { type: String, required: true },
    line2: String,
    city: { type: String, required: true },
    district: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'Sri Lanka' },
});
const pricingSchema = new mongoose_1.Schema({
    itemsTotal: { type: Number, required: true },
    discountTotal: { type: Number, default: 0 },
    shippingFee: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
});
const paymentSchema = new mongoose_1.Schema({
    method: { type: String, enum: types_1.PAYMENT_METHODS, default: 'cod' },
    status: { type: String, enum: types_1.PAYMENT_STATUSES, default: 'confirmed' },
});
const orderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    customer: { type: customerSnapshotSchema, required: true },
    shippingAddress: { type: shippingAddressSchema, required: true },
    district: { type: String, required: true },
    shippingFee: { type: Number, required: true },
    pricing: { type: pricingSchema, required: true },
    payment: { type: paymentSchema, required: true },
    status: {
        type: String,
        enum: types_1.ORDER_STATUSES,
        default: 'new'
    },
    createdAt: { type: Date, default: Date.now },
});
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
const Order = mongoose_1.default.models.Order || mongoose_1.default.model('Order', orderSchema);
exports.default = Order;
