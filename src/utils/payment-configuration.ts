import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

interface InitializePaymentRequest {
    amount: number;
}

router.post('/initialize', async (req: Request, res: Response) => {
    const { amount }: InitializePaymentRequest = req.body;

    try {
        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email: 'user@example.com', // Replace with the authenticated user's email
                amount: amount * 100, // Paystack uses the smallest currency unit
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        res.status(200).json({ authorization_url: response.data.data.authorization_url });
    } catch (error: any) {
        console.error('Paystack initialization error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Payment initialization failed' });
    }
});

export default router;
