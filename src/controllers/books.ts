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

export { getAllBooks, createBook }