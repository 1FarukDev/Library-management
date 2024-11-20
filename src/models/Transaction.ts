import mongoose, { Schema, Document } from "mongoose";

interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number; 
    reference: string; 
    status: "pending" | "success" | "failed"; 
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema: Schema<ITransaction> = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        reference: {
            type: String,
            unique: true, 
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending", 
        },
    },
    {
        timestamps: true, 
    }
);

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
