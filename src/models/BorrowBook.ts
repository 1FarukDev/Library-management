import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { IBook } from "./Books";

export interface IBorrow extends Document {
    user: IUser["_id"];
    book: IBook["_id"];
    borrowedAt: Date;
    dueDate: Date;
    returnedAt?: Date;
}

const BorrowSchema = new Schema<IBorrow>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        book: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
        borrowedAt: {
            type: Date,
            default: Date.now,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        returnedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IBorrow>("Borrow", BorrowSchema);
