import { Request, Response } from "express";
import { BadRequestError, UnauthenticatedError } from "../errors";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";

const register = async (req: Request, res: Response) => {
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
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


export { login, register }