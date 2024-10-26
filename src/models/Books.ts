import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User"; 

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
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                // ret.id = ret._id;
                // delete ret._id;
                delete ret.__v;
            },
        },
    }
);

export default mongoose.model<IBook>("Book", bookSchema);
