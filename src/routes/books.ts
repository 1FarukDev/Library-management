import { Router } from "express";
import authenticateMiddleware from "../middleware/authentication";
import adminonlyMiddleware from "../middleware/admin-only";
import { createBook, deleteBook, getAllBooks, getSingleBook, updateBook } from "../controllers/books";

const router: Router = Router()

router.route('/').get(getAllBooks)

router.route('/').post(authenticateMiddleware, adminonlyMiddleware, createBook)

router.route('/:id').patch(authenticateMiddleware, adminonlyMiddleware, updateBook).delete(authenticateMiddleware, adminonlyMiddleware, deleteBook).get(getSingleBook)


export default router