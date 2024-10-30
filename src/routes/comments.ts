import { Router } from "express";
import authenticateMiddleware from "../middleware/authentication";
import { createComment, getComment } from "../controllers/comments";

const router: Router = Router()


router.route('/:bookId/comments').post(authenticateMiddleware, createComment).get(getComment)


export default router