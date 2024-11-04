import { Request, Response, NextFunction } from "express";
import Books from "../models/Books";
import { StatusCodes } from "http-status-codes"

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        name: string

    }
}

const getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const books = await Books.find({})
        res.status(StatusCodes.OK).json({ books, count: books.length })
    } catch (error) {
        next(error)
    }
}


const createBook = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user || !req.user.userId) {
            const error = new Error('Unauthorized') as any;
            error.statusCodes = StatusCodes.UNAUTHORIZED;
            throw error
        }

        req.body.createdBy = req.user.userId;
        const book = await Books.create(req.body)
        res.status(StatusCodes.CREATED).json({ book })
    } catch (error) {
        next(error)
    }
}

const updateBook = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params
        const { userId } = req.user || {}
        if (!userId) {
            const error = new Error('Unauthorizes') as any;
            error.statusCodes = StatusCodes.UNAUTHORIZED
            throw error
        }
        const book = await Books.findOneAndUpdate(
            { _id: id, createdBy: userId },
            req.body,
            { new: true, runValidators: true }
        )
        if (!book) {
            const error = new Error('Book not found or you are not authorized to edit the book') as any
            error.statusCodes = StatusCodes.NOT_FOUND
            throw error
        }
        res.status(StatusCodes.OK).json({ book })
    } catch (error) {

    }
}

export { getAllBooks, createBook, updateBook }