import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IBook } from './Books';

export interface IPurchase extends Document {
    user: IUser["_id"];
    book: IBook["_id"];
    format: 'physical' | 'ebook';
    price: number;
    purchasedAt: Date;
}

const purchaseSchema = new Schema<IPurchase>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    format: { type: String, enum: ['physical', 'ebook'], required: true },
    price: { type: Number, required: true },
    purchasedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPurchase>('Purchase', purchaseSchema);
