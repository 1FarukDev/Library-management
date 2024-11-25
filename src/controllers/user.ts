import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "../@types/express";

const updateUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.user || {}
        if (!userId) {
            const error = new Error('Unauthorized') as any;
            error.statusCodes = StatusCodes.UNAUTHORIZED
            throw error
        }
        const user = await User.findOneAndUpdate({ _id: userId }, req.body, { new: true, runValidators: true })
        if (!user) {
            const error = new Error('user not found') as any
            error.statusCodes = StatusCodes.NOT_FOUND
            throw error
        }
        res.status(StatusCodes.OK).json({ user })

    } catch (error) {
        next(error)
    }
}
const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.query || {}
        if (!userId) {
            const error = new Error('User not found') as any
            error.statusCodes = StatusCodes.NOT_FOUND
            throw error
        }
        const user = await User.findById(userId)
        res.status(StatusCodes.OK).json({ user })
    } catch (error) {
        next(error)
    }
}
export { updateUserProfile, getUserProfile }