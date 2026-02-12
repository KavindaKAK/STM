import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICartItem {
    productId: Types.ObjectId;
    qty: number;
    priceSnapshot: number;
    nameSnapshot: string;
    imageSnapshot: string;
}

export interface ICart extends Document {
    userId: Types.ObjectId;
    items: ICartItem[];
    updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 1 },
    priceSnapshot: { type: Number, required: true },
    nameSnapshot: { type: String, required: true },
    imageSnapshot: { type: String, required: true },
});

const cartSchema = new Schema<ICart>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    updatedAt: { type: Date, default: Date.now },
});

cartSchema.index({ userId: 1 }, { unique: true });

const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>('Cart', cartSchema);

export default Cart;
