import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../@types/express";
import User from "../models/User";
import Transaction from "../models/Transaction";


import dotenv from 'dotenv';
dotenv.config();


const initializePayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.user || {};
        const { amount } = req.body; // Amount in kobo (Naira * 100)

        if (!amount || amount <= 0) {
            res.status(400).json({ message: "Invalid amount." });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        const reference = uuidv4();


        const transaction = new Transaction({
            userId: user._id,
            amount: amount / 100,
            reference,
            status: "pending",
        });
        await transaction.save();



        const paystackResponse = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email: user.email,
                amount,
                reference,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        const { status, data } = paystackResponse.data;

        if (!status) {
            res.status(400).json({ message: "Payment initialization failed." });
            return;
        }

        res.status(200).json({
            message: "Payment initialized successfully.",
            authorization_url: data.authorization_url,
            reference: data.reference,
        });
    } catch (error) {
        next(error);
    }
};

const verifyPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { reference } = req.body;

        if (!reference) {
            res.status(400).json({ message: "Transaction reference is required." });
            return;
        }


        const paystackResponse = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        const { status, data } = paystackResponse.data;
        console.log(status, data, 'data for transaction')
        if (!status || data.status !== "success") {
            res.status(400).json({ message: "Transaction verification failed or payment was unsuccessful." });
            return;
        }


        const user = await User.findById(data.metadata.userId);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }


        const existingTransaction = await Transaction.findOne({ reference });
        if (existingTransaction) {
            res.status(400).json({ message: "Duplicate transaction." });
            return;
        }


        user.balance += data.amount / 100
        await user.save();

        const transaction = new Transaction({
            userId: user._id,
            amount: data.amount / 100,
            reference,
            status: "success",
        });

        await transaction.save();

        res.status(200).json({ message: "Payment verified and balance updated.", balance: user.balance });
    } catch (error) {
        next(error);
    }
};


export { initializePayment, verifyPayment };
