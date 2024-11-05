import { Router } from "express";
import authenticateMiddleware from "../middleware/authentication";
import { createComment, getComment, updateComment } from "../controllers/comments";

const router: Router = Router()


router.route('/:bookId').post(authenticateMiddleware, createComment).get(getComment)
router.route('/:bookId/:commentId').patch(authenticateMiddleware, updateComment)


export default router