import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "../@types/express";
import { AvatarUploadService } from "../service/upload-services";
import { v2 as cloudinary } from 'cloudinary';

const updateUserProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId } = req.user || {};
        if (!userId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Unauthorized" });
            return
        }


        const existingUser = await User.findById(userId);
        if (!existingUser) {
            res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
            return
        }


        const updateData: any = { ...req.body };


        if (req.file) {
            if (existingUser.avatar && existingUser.avatar.id) {
                await cloudinary.api.delete_resources([existingUser.avatar.id],
                    { type: 'upload', resource_type: 'image' })
            }


            const cloudinaryUpload = await AvatarUploadService.uploadAvatar(req.file.buffer, req.file.originalname);
            updateData.avatar = {
                url: cloudinaryUpload.url,
                id: cloudinaryUpload.publicId,
            };
        }


        const updatedUser = await User.findOneAndUpdate({ _id: userId }, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
            return
        }

        res.status(StatusCodes.OK).json({ user: updatedUser });
    } catch (error) {
        next(error);
    }
};


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