import transporter from "./transporter";


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
