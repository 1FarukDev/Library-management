import { Request, Response, NextFunction } from "express";
import Books from "../models/Books";
import { StatusCodes } from "http-status-codes"
import mongoose from 'mongoose';
import { AuthenticatedRequest } from "../@types/express";


const getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { query } = req
    try {
        const books = await Books.find(req.query)
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
            const error = new Error('Unauthorized') as any;
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
        next(error)
    }
}

const deleteBook = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params
        const { userId } = req.user || {}
        if (!userId) {
            const error = new Error('Unauthorized') as any;
            error.statusCodes = StatusCodes.UNAUTHORIZED
            throw error
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('Invalid blog post ID') as any;
            error.statusCode = StatusCodes.BAD_REQUEST;
            throw error;
        }
        const book = await Books.findOneAndDelete({ _id: id, createdBy: userId });
        if (!book) {
            const error = new Error('Book not found or you are not authorized to delete it') as any;
            error.statusCode = StatusCodes.NOT_FOUND;
            throw error;
        }
        res.status(StatusCodes.OK).json({ message: 'Book has been successfully deleted' })
    } catch (error) {
        next(error)
    }
}

const getSingleBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params
        const book = await Books.findById(id);
        if (!book) {
            const error = new Error('Book not found') as any;
            error.statusCode = StatusCodes.NOT_FOUND;
            throw error;
        }
        res.status(StatusCodes.OK).json({ book })
    } catch (error) {
        next(error)
    }
}

export { getAllBooks, createBook, updateBook, deleteBook, getSingleBook }