import { Request, Response } from "express";
import { BadRequestError, UnauthenticatedError } from "../errors";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import generateVerificationToken from "../utils/generate-tokem";
import { sendVerificationEmail } from "../utils/send-email";
import UserVerification from "../models/UserVerification";

const register = async (req: Request, res: Response) => {
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    const verificationToken = await generateVerificationToken(user.id);
    await sendVerificationEmail(user.email, verificationToken);
    res.status(StatusCodes.CREATED).json({ user: { id: user.id, last_name: user.last_name, first_name: user.first_name }, token })
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Please provide email and password");
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new UnauthenticatedError("Invalid credentials");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid credentials");
    }
    const token = user.createJWT();
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(StatusCodes.OK).json({ user: userWithoutPassword, token });
};
const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query;
    if (!token) {
        throw new BadRequestError("Verification token is missing.");
    }
    const verificationRecord = await UserVerification.findOne({ token });
    if (!verificationRecord) {
        throw new BadRequestError("Invalid or expired verification token.");
    }
    const { userId, expiresAt } = verificationRecord;
    if (new Date() > expiresAt) {
        throw new BadRequestError("Verification token has expired.");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new BadRequestError("User not found.");
    }

    user.isVerified = true;
    await user.save();

    await UserVerification.findByIdAndDelete(verificationRecord._id);

    res.status(StatusCodes.OK).json({ message: "Email verified successfully." });
};


export { login, register, verifyEmail }