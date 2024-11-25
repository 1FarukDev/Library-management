import { Router } from "express";
import { register, login, verifyEmail, requestVerificationEmail, forgotPassword, resetPassword, handleGoogleCallback, initiateGoogleAuth } from "../controllers/auth";
import checkVerified from "../middleware/check-verification";

const router: Router = Router()

router.post('/register', register)
router.post('/login', checkVerified, login)
router.get("/verify-email", verifyEmail);
router.post("/request-verification-email", requestVerificationEmail);
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)
router.get("/google", initiateGoogleAuth);
router.get("/google/callback", handleGoogleCallback);


export default router