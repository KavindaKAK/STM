import mongoose, { Schema, Document, Model } from 'mongoose';
import { SRI_LANKA_DISTRICTS, District } from '../types';

export interface IShippingFee extends Document {
    district: District;
    feeLkr: number;
}

const shippingFeeSchema = new Schema<IShippingFee>({
    district: {
        type: String,
        enum: SRI_LANKA_DISTRICTS,
        required: true,
        unique: true
    },
    feeLkr: { type: Number, required: true, min: 0, default: 0 },
});

shippingFeeSchema.index({ district: 1 }, { unique: true });

const ShippingFee: Model<IShippingFee> = mongoose.models.ShippingFee || mongoose.model<IShippingFee>('ShippingFee', shippingFeeSchema);

export default ShippingFee;
