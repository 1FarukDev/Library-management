import crypto from "crypto";
import mongoose from "mongoose";
import PasswordReset from "../models/PasswordReset";

const generateResetToken = async (userId: mongoose.Types.ObjectId) => {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); 

    await PasswordReset.create({
        userId,
        token,
        expiresAt,
    });

    return token;
};

export default generateResetToken;
