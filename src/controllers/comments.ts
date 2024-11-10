import { Request, Response, NextFunction } from "express";
import Books from "../models/Books";
import Comments from "../models/comments";
import { StatusCodes } from "http-status-codes"
import { AuthenticatedRequest } from "../@types/express";
import mongoose from "mongoose";


const getComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { bookId } = req.params
        const comment = await Comments.find({ book: bookId }).populate("user", "name");
        if (!comment || comment.length === 0) {
            const error = new Error("Comment not found") as any
            error.statusCode = StatusCodes.NOT_FOUND
            throw error
        }
        res.status(StatusCodes.OK).json({ comment: comment, count: comment.length })
    } catch (error) {
        next(error)
    }
}

const createComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user || !req.user.userId) {
            const error = new Error("Unauthorized") as any;
            error.statusCode = StatusCodes.UNAUTHORIZED;
            throw error;
        }
        const { bookId } = req.params
        const { comment, rating } = req.body
        const book = await Books.findById(bookId)
        if (!book) {
            const error = new Error('Book not found') as any;
            error.statusCode = StatusCodes.NOT_FOUND
            throw error
        }
        const newComment = await Comments.create({
            user: req.user.userId,
            book: bookId,
            comment,
            rating,
        });
        book.comments.push(newComment._id)
        await book.save()

        res.status(StatusCodes.CREATED).json({ comment: newComment });

    } catch (error) {
        next(error)
    }
}

const updateComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { commentId } = req.params
        const { userId } = req.user || {}
        if (!userId) {
            const error = new Error('Unauthorized') as any;
            error.statusCodes = StatusCodes.UNAUTHORIZED
            throw error
        }
        const comment = await Comments.findByIdAndUpdate(
            { _id: commentId, createdBy: userId },
            req.body,
            { new: true, runValidators: true }
        )
        if (!comment) {
            const error = new Error('Comment not found or you are not authorized to edit the book') as any
            error.statusCodes = StatusCodes.NOT_FOUND
            throw error
        }
        res.status(StatusCodes.OK).json({ comment })
    } catch (error) {
        next(error)
    }
}
const deleteComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { commentId } = req.params
        const { userId } = req.user || {}
        if (!userId) {
            const error = new Error('Unauthorized') as any;
            error.statusCodes = StatusCodes.UNAUTHORIZED
            throw error
        }
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            const error = new Error('Invalid comment post ID') as any;
            error.statusCode = StatusCodes.BAD_REQUEST;
            throw error;
        }
        const comment = await Comments.findOneAndDelete({ _id: commentId, user: userId });

        if (!comment) {
            const error = new Error('Comment not found or you are not authorized to delete it') as any;
            error.statusCode = StatusCodes.NOT_FOUND;
            throw error;
        }
        res.status(StatusCodes.OK).json({ message: 'Comment has been successfully deleted' })
    } catch (error) {
        next(error)
    }
}

export { createComment, getComment, updateComment, deleteComment }