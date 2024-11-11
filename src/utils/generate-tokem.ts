import crypto from "crypto";
import UserVerification from "../models/UserVerification";
import mongoose from "mongoose";

const generateVerificationToken = async (userId: mongoose.Types.ObjectId) => {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token expires in 24 hours

    await UserVerification.create({
        userId,
        token,
        expiresAt,
    });

    return token;
};


export default generateVerificationToken