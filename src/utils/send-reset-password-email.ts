import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: 587,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});

export const sendResetPasswordEmail = async (email: string, resetUrl: string) => {
    const mailOptions = {
        from: '"YourApp" <admin@librarymanagement.com>',
        to: email,
        subject: "Reset Your Password",
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Reset password email sent to:", email);
    } catch (error) {
        console.error("Failed to send reset password email:", error);
    }
};
