import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES, OrderStatus, PaymentMethod, PaymentStatus } from '@/types';

export interface IOrderItem {
    productId: Types.ObjectId;
    nameSnapshot: string;
    priceSnapshot: number;
    qty: number;
    imageSnapshot: string;
}

export interface ICustomerSnapshot {
    name: string;
    email: string;
    phone: string;
}

export interface IShippingAddress {
    line1: string;
    line2?: string;
    city: string;
    district: string;
    postalCode: string;
    country: string;
}

export interface IPricing {
    itemsTotal: number;
    discountTotal: number;
    shippingFee: number;
    grandTotal: number;
}

export interface IPayment {
    method: PaymentMethod;
    status: PaymentStatus;
}

export interface IOrder extends Document {
    userId: Types.ObjectId;
    items: IOrderItem[];
    customer: ICustomerSnapshot;
    shippingAddress: IShippingAddress;
    district: string;
    shippingFee: number;
    pricing: IPricing;
    payment: IPayment;
    status: OrderStatus;
    createdAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    nameSnapshot: { type: String, required: true },
    priceSnapshot: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    imageSnapshot: { type: String, required: true },
});

const customerSnapshotSchema = new Schema<ICustomerSnapshot>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
});

const shippingAddressSchema = new Schema<IShippingAddress>({
    line1: { type: String, required: true },
    line2: String,
    city: { type: String, required: true },
    district: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'Sri Lanka' },
});

const pricingSchema = new Schema<IPricing>({
    itemsTotal: { type: Number, required: true },
    discountTotal: { type: Number, default: 0 },
    shippingFee: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
});

const paymentSchema = new Schema<IPayment>({
    method: { type: String, enum: PAYMENT_METHODS, default: 'cod' },
    status: { type: String, enum: PAYMENT_STATUSES, default: 'confirmed' },
});

const orderSchema = new Schema<IOrder>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    customer: { type: customerSnapshotSchema, required: true },
    shippingAddress: { type: shippingAddressSchema, required: true },
    district: { type: String, required: true },
    shippingFee: { type: Number, required: true },
    pricing: { type: pricingSchema, required: true },
    payment: { type: paymentSchema, required: true },
    status: {
        type: String,
        enum: ORDER_STATUSES,
        default: 'new'
    },
    createdAt: { type: Date, default: Date.now },
});

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
