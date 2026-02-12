import mongoose, { Schema, Document, Model } from 'mongoose';
import { PRODUCT_TYPES, ProductType } from '../types';

export interface ITyreSpecs {
    sizeText: string;
    width: string;
    profile: string;
    rim: string;
    speedRating?: string;
    loadIndex?: string;
    pattern?: string;
    vehicleType?: string;
}

export interface IBatterySpecs {
    voltage?: string;
    ah?: string;
    cca?: string;
    batteryType?: string;
}

export interface IAccessorySpecs {
    fitment?: string;
}

export interface IProduct extends Document {
    type: ProductType;
    accessoryCategory?: string;
    name: string;
    brand: string;
    sku: string;
    price: number;
    discountType?: 'percent' | 'fixed';
    discountValue?: number;
    salePrice: number;
    stockQty: number;
    images: string[];
    shortDesc?: string;
    longDesc?: string;
    tags: string[];
    status: 'active' | 'draft' | 'outOfStock';
    salesCount: number;
    specs?: ITyreSpecs | IBatterySpecs | IAccessorySpecs;
    createdAt: Date;
}

const productSchema = new Schema<IProduct>({
    type: {
        type: String,
        enum: PRODUCT_TYPES,
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
        type: Schema.Types.Mixed,
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

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
