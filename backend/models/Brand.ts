import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBrand extends Document {
    name: string;
    logoUrl: string;
    sortOrder: number;
    isActive: boolean;
}

const brandSchema = new Schema<IBrand>({
    name: { type: String, required: true, unique: true },
    logoUrl: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
});

brandSchema.index({ sortOrder: 1 });

const Brand: Model<IBrand> = mongoose.models.Brand || mongoose.model<IBrand>('Brand', brandSchema);

export default Brand;
