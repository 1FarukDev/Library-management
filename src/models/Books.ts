import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { IComment } from "./comments";

export interface IBook extends Document {
    title: string;
    author: string;
    price: number;
    formats: {
        physical?: {
            stock: number;
            shipping_details: string;
        };
        ebook?: {
            available: boolean;
            file_formats: string[];
            file_size: string;
            file_url?: string;
        };
    };
    createdBy: IUser["_id"];
    comments: IComment["_id"][];
    bookUrl: string
    cloudinaryPublicId: string
    sales: number;
    createdAt: Date;
    updatedAt: Date;
}

const bookSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        formats: {
            physical: {
                stock: {
                    type: Number,
                    default: 0,
                    min: 0,
                },
                shipping_details: {
                    type: String,
                    default: "Ships within 5 business days",
                },
            },
            ebook: {
                available: {
                    type: Boolean,
                    default: false,
                },
                file_formats: {
                    type: [String],
                    enum: ["pdf", "epub", "mobi"],
                    default: undefined,
                },
                file_size: {
                    type: String,
                    default: "0MB",
                },
                file_url: {
                    type: String,
                    trim: true,
                },
            },
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: "comments",
            },
        ],
        sales: {
            type: Number,
            default: 0,
        },
        cloudinaryPublicId: {
            type: String,
            trim: true
        },
        bookUrl: {
            type: String,
            trim: true
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.__v;
            },
        },
    }
);

export default mongoose.model<IBook>("Book", bookSchema);
