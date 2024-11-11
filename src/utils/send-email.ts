import nodemailer from 'nodemailer';
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
export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;

  const mailOptions = {
    from: '"YourApp" <admin@librarymanagement.com>',
    to: email,
    subject: 'Verify Your Email Address',
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
  } catch (error) {
    console.error('Failed to send verification email:', error);
  }
};
