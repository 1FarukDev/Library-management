import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    isVerified: boolean;
    phone_number: number;
    password: string;
    avatar: {
        url: string;
        id: string;
    };
    role: "user" | "admin";
    createdAt: Date;
    updatedAt: Date;
    createJWT: () => string;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        first_name: {
            type: String,
            required: true,
            trim: true,
        },
        last_name: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            set: (value: string) => value.toLowerCase(),
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: (value: string) =>
                    /^[\w\-]+(\.[\w\-]+)*@([\w-]+\.)+[\w-]{2,}$/.test(value),
                message: "Invalid email format",
            },
        },
        avatar: {
            url: { type: String, default: "" },
            id: { type: String, default: "" },
        },
        phone_number: {
            type: Number,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            default: "user",
            enum: ["user", "admin"],
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
            },
        },
    }
);
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.methods.createJWT = function (): string {
    return jwt.sign(
        { userId: this._id, name: this.username },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_LIFETIME }
    );
};
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
