import { Router } from "express";
import { register, login, verifyEmail, requestVerificationEmail, forgotPassword, resetPassword } from "../controllers/auth";
import checkVerified from "../middleware/check-verification";

const router: Router = Router()

router.post('/register', register)
router.post('/login', checkVerified, login)
router.get("/verify-email", verifyEmail);
router.post("/request-verification-email", requestVerificationEmail);
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

export default router