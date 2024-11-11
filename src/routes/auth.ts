import { Router } from "express";
import { register, login, verifyEmail } from "../controllers/auth";

const router: Router = Router()

router.post('/register', register)
router.post('/login', login)
router.get("/verify-email", verifyEmail);

export default router