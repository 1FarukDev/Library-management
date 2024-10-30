import { Request, Response, NextFunction } from "express";
import Books from "../models/Books";
import Comments from "../models/comments";
import { StatusCodes } from "http-status-codes"
import { AuthenticatedRequest } from "../@types/express";


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

export { createComment }