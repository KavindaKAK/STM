import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IInvoice extends Document {
    orderId: Types.ObjectId;
    invoiceNumber: string;
    pdfPathOrStorageKey: string;
    createdAt: Date;
}

const invoiceSchema = new Schema<IInvoice>({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    invoiceNumber: { type: String, required: true, unique: true },
    pdfPathOrStorageKey: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

invoiceSchema.index({ orderId: 1 }, { unique: true });
invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });

const Invoice: Model<IInvoice> = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', invoiceSchema);

export default Invoice;
