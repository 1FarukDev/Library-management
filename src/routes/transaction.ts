import { Router } from "express";
import authenticateMiddleware from "../middleware/authentication";
import { initializePayment, verifyPayment } from "../controllers/transaction";

const router: Router = Router()


router.route('/initialize-payment').post(authenticateMiddleware, initializePayment)
router.route('/verify-payment').post(verifyPayment)


export default router