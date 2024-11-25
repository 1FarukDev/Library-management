import { Router } from "express";
import { getUserProfile, updateUserProfile } from "../controllers/user";
import authenticateMiddleware from "../middleware/authentication";

const router: Router = Router()


router.get("/user-profile", getUserProfile)
router.patch("/user-profile", authenticateMiddleware, updateUserProfile)

export default router