import { Router } from "express";
import { getUserProfile, updateUserProfile } from "../controllers/user";
import authenticateMiddleware from "../middleware/authentication";
import uploadMiddleware from "../middleware/upload-middleware";

const router: Router = Router()


router.get("/user-profile", getUserProfile)
router.patch("/user-profile", authenticateMiddleware, uploadMiddleware.single('avatar'), updateUserProfile)

export default router