import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IWishlist extends Document {
    userId: Types.ObjectId;
    productIds: Types.ObjectId[];
}

const wishlistSchema = new Schema<IWishlist>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    productIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

wishlistSchema.index({ userId: 1 }, { unique: true });

const Wishlist: Model<IWishlist> = mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', wishlistSchema);

export default Wishlist;
