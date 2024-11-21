import { Router } from "express";
import authenticateMiddleware from "../middleware/authentication";
import adminonlyMiddleware from "../middleware/admin-only";
import { createBook, deleteBook, getAllBooks, getSingleBook, updateBook, getSearchedBooks, borrowBook, returnBook, buyBook } from "../controllers/books";
import uploadMiddleware from "../middleware/upload-middleware";


const router: Router = Router()

router.route('/').get(getAllBooks)
router.route('/search/:key').get(getSearchedBooks)

router.route('/').post(authenticateMiddleware, adminonlyMiddleware, uploadMiddleware.single('book'), createBook)

router.route('/:id').patch(authenticateMiddleware, adminonlyMiddleware, updateBook).delete(authenticateMiddleware, adminonlyMiddleware, deleteBook).get(getSingleBook)
router.route('/borrow').post(authenticateMiddleware, borrowBook)
router.route('/return').post(authenticateMiddleware, returnBook)
router.route('/buy').post(authenticateMiddleware, buyBook)


export default router