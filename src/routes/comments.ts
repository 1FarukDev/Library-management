import { Router } from "express";
import authenticateMiddleware from "../middleware/authentication";
import { createComment } from "../controllers/comments";

const router: Router = Router()


router.route('/:bookId/comments').post(authenticateMiddleware, createComment)


export default router