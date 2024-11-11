import { Request, Response, NextFunction } from "express";
import { UnauthenticatedError } from "../errors";
import User from "../models/User";

const checkVerified = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
        throw new UnauthenticatedError("Email is required to check verification.");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError("User not found.");
    }
    if (!user.isVerified) {
        throw new UnauthenticatedError("Your account is not verified. Please verify your email.");
    }
    next();
};

export default checkVerified;
