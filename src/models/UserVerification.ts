import mongoose, { Document, Schema } from "mongoose";

interface IUserVerify extends Document {
  userId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

const UserVerificationSchema = new Schema<IUserVerify>({
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const UserVerification = mongoose.model<IUserVerify>(
  "UserVerification",
  UserVerificationSchema
);

export default UserVerification;
