import { Router } from "express";
import {  getUserProfile } from "../controllers/user";

const router: Router = Router()


router.get("/user-profile", getUserProfile)

export default router