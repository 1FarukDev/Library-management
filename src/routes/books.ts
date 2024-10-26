import { Router } from "express";
import authenticateMiddleware from "../middleware/authentication";
import { createBook, getAllBooks } from "../controllers/books";

const router: Router = Router()

router.route('/').get(getAllBooks)

router.route('/').post(authenticateMiddleware, createBook)


export default router