import { Request, Response, NextFunction } from "express";
import Books from "../models/Books";
import { StatusCodes } from "http-status-codes"
import mongoose from 'mongoose';
import { AuthenticatedRequest } from "../@types/express";
import BorrowBook from "../models/BorrowBook";
import PurchaseBooks from "../models/PurchaseBooks";
import { BookUploadService } from "../service/upload-services";
import { v2 as cloudinary } from 'cloudinary';


const getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const books = await Books.find(req.query)
        res.status(StatusCodes.OK).json({ books, count: books.length })
    } catch (error) {
        next(error)
    }
}

const getSearchedBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { key } = req.params
    try {
        const books = await Books.find(
            {
                "$or": [
                    { author: { $regex: key } },
                    { price: parseFloat(key) }
                ]
            }
        )
        res.status(StatusCodes.OK).json({ books, count: books.length })
    } catch (error) {
        next(error)
    }
}

const createBook = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {

        if (!req.user || !req.user.userId) {
            const error = new Error('Unauthorized') as any;
            error.statusCode = StatusCodes.UNAUTHORIZED;
            throw error;
        }
        if (!req.file) {
            const error = new Error('No book file uploaded') as any;
            error.statusCode = StatusCodes.BAD_REQUEST;
            throw error;
        }
        const cloudinaryUpload = await BookUploadService.uploadBook(req.file.buffer, req.file.originalname);
        const bookData = {
            ...req.body,
            createdBy: req.user.userId,
            bookUrl: cloudinaryUpload.url,
            cloudinaryPublicId: cloudinaryUpload.publicId
        };
        const book = await Books.create(bookData);
        res.status(StatusCodes.CREATED).json({ book });
    } catch (error) {
        next(error);
    }
};


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
        const { id } = req.params;
        const { userId } = req.user || {};

        if (!userId) {
            const error = new Error('Unauthorized') as any;
            error.statusCode = StatusCodes.UNAUTHORIZED;
            throw error;
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('Invalid Book ID') as any;
            error.statusCode = StatusCodes.BAD_REQUEST;
            throw error;
        }
        const book = await Books.findOne({ _id: id, createdBy: userId });
        if (!book) {
            const error = new Error('Book not found or you are not authorized to delete it') as any;
            error.statusCode = StatusCodes.NOT_FOUND;
            throw error;
        }
        if (book.cloudinaryPublicId) {
            await cloudinary.api
                .delete_resources([book.cloudinaryPublicId],
                    { type: 'upload', resource_type: 'raw' })

        }
        const deletedBook = await Books.findOneAndDelete({ _id: id, createdBy: userId });
        if (!deletedBook) {
            const error = new Error('Error deleting the book record') as any;
            error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
            throw error;
        }

        res.status(StatusCodes.OK).json({ message: 'Book has been successfully deleted' });
    } catch (error) {
        next(error);
    }
};

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

const borrowBook = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.user || {}
        const { bookId, dueDate } = req.body
        const book = await Books.findById(bookId);
        if (!book || !book.formats.physical || book.formats.physical.stock < 1) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Book not available for borrowing" });
            return
        }
        const borrow = await BorrowBook.create({
            user: userId,
            book: bookId,
            dueDate
        })

        book.formats.physical.stock -= 1
        await book.save()
        res.status(StatusCodes.CREATED).json({ borrow })
    } catch (error) {
        next(error)
    }
}

const returnBook = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.user || {}
        const { bookId } = req.body
        const borrowRecord = await BorrowBook.findOne({ book: bookId, user: userId })
        if (!borrowRecord) {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'No borrow record found for this book and the user' })
            return
        }
        const book = await Books.findById(bookId)
        if (!book || !book.formats.physical) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Book not available" });
            return
        }

        book.formats.physical.stock += 1
        await book.save()
        await BorrowBook.findByIdAndDelete(borrowRecord._id)
        res.status(StatusCodes.OK).json({ message: 'Book returned successfully' });

    } catch (error) {
        next(error)
    }
}

const buyBook = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId } = req.user || {}
        const { bookId, format, quantity } = req.body;

        const book = await Books.findById(bookId);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        if (format === 'physical') {
            if (!book.formats.physical) {
                res.status(400).json({ message: 'Physical format is not available for this book.' });
                return;
            }

            if (book.formats.physical.stock < quantity) {
                res.status(400).json({ message: 'Not enough stock available' });
                return;
            }
            book.formats.physical.stock -= quantity;
        }
        const purchaseBook = await PurchaseBooks.create({
            user: userId,
            book: book._id,
            format: format,
            price: book.price * quantity,
            purchasedAt: new Date(),
        })
        book.sales = (book.sales || 0) + quantity;
        await book.save();

        res.status(200).json({ message: 'Purchase successful', purchaseBook });
    } catch (error) {
        next(error);
    }
};

export { getAllBooks, createBook, updateBook, deleteBook, getSingleBook, getSearchedBooks, borrowBook, returnBook, buyBook }