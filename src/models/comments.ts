import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { IBook } from "./Books";

export interface IComment extends Document {
    user: IUser["_id"];
    book: IBook["_id"];
    comment: string;
    rating: number;
    createdAt: Date;
}

const commentSchema: Schema = new Schema(
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
        comment: {
            type: String,
            required: true,
            trim: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IComment>("Comment", commentSchema);
