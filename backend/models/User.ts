import mongoose, { Schema, Document, Model } from 'mongoose';
import { USER_ROLES, UserRole } from '../types';

export interface IAddress {
    label: string;
    line1: string;
    line2?: string;
    city: string;
    district: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

export interface IUser extends Document {
    role: UserRole;
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    addresses: IAddress[];
    createdAt: Date;
}

const addressSchema = new Schema<IAddress>({
    label: { type: String, required: true },
    line1: { type: String, required: true },
    line2: String,
    city: { type: String, required: true },
    district: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'Sri Lanka' },
    isDefault: { type: Boolean, default: false },
});

const userSchema = new Schema<IUser>({
    role: {
        type: String,
        enum: USER_ROLES,
        default: 'customer',
        required: true
    },
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    addresses: [addressSchema],
    createdAt: { type: Date, default: Date.now },
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
