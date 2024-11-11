import { Router } from "express";
import { register, login, verifyEmail, requestVerificationEmail } from "../controllers/auth";
import checkVerified from "../middleware/check-verification";

const router: Router = Router()

router.post('/register', register)
router.post('/login', checkVerified, login)
router.get("/verify-email", verifyEmail);
router.post("/request-verification-email", requestVerificationEmail);

export default router