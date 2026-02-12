import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBanner extends Document {
    title: string;
    imageUrl: string;
    linkUrl?: string;
    isActive: boolean;
    sortOrder: number;
}

const bannerSchema = new Schema<IBanner>({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    linkUrl: String,
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
});

bannerSchema.index({ isActive: 1, sortOrder: 1 });

const Banner: Model<IBanner> = mongoose.models.Banner || mongoose.model<IBanner>('Banner', bannerSchema);

export default Banner;
