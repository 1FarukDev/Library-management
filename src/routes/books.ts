import { Router } from "express";
import authenticateMiddleware from "../middleware/authentication";
import { createBook, deleteBook, getAllBooks, getSingleBook, updateBook } from "../controllers/books";

const router: Router = Router()

router.route('/').get(getAllBooks)

router.route('/').post(authenticateMiddleware, createBook)

router.route('/:id').patch(authenticateMiddleware, updateBook).delete(authenticateMiddleware, deleteBook).get(getSingleBook)


export default router