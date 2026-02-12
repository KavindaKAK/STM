import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IReview extends Document {
    userId: Types.ObjectId;
    productId?: Types.ObjectId;
    rating: number;
    comment: string;
    isApproved: boolean;
    createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

reviewSchema.index({ isApproved: 1, createdAt: -1 });
reviewSchema.index({ productId: 1, isApproved: 1 });

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);

export default Review;
