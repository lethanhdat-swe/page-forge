import nodemailer from "nodemailer";

export class MailService {
    private static transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: process.env.SMTP_PORT === "465",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    public static async sendVerificationEmail(
        to: string,
        token: string,
    ): Promise<void> {
        const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
        const verificationLink = `${clientUrl}/verify-email?token=${token}`;

        const mailOptions = {
            from: `"PageForge Support" <${process.env.SMTP_USER}>`,
            to,
            subject: "Verify Your Email Address",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #333333; text-align: center;">Welcome to PageForge!</h2>
                    <p style="font-size: 16px; color: #555555; line-height: 1.5;">
                        Thank you for registering. Please verify your email address by clicking the button below:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 4px; display: inline-block;">Verify Email</a>
                    </div>
                    <p style="font-size: 14px; color: #777777;">
                        If the button above does not work, you can copy and paste the following link into your web browser:
                    </p>
                    <p style="font-size: 14px; color: #0066cc; word-break: break-all;">
                        <a href="${verificationLink}">${verificationLink}</a>
                    </p>
                    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #999999; text-align: center;">
                        This email was sent by PageForge. If you did not create an account, please ignore this email.
                    </p>
                </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(
                `[Mail Service]: Verification email successfully sent to ${to}`,
            );
        } catch (error) {
            console.error(
                `[Mail Service Error]: Failed to send verification email to ${to}`,
                error,
            );
            throw error;
        }
    }

    public static async sendPasswordResetEmail(
        to: string,
        token: string,
    ): Promise<void> {
        const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
        const resetLink = `${clientUrl}/reset-password?token=${token}`;

        const mailOptions = {
            from: `"PageForge Support" <${process.env.SMTP_USER}>`,
            to,
            subject: "Reset Your Password",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #333333; text-align: center;">Reset Your Password</h2>
                    <p style="font-size: 16px; color: #555555; line-height: 1.5;">
                        You have requested to reset your password. Please click the button below to set a new password:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #3f51b5; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 4px; display: inline-block;">Reset Password</a>
                    </div>
                    <p style="font-size: 14px; color: #777777;">
                        If the button above does not work, you can copy and paste the following link into your web browser:
                    </p>
                    <p style="font-size: 14px; color: #0066cc; word-break: break-all;">
                        <a href="${resetLink}">${resetLink}</a>
                    </p>
                    <p style="font-size: 14px; color: #777777;">
                        This link will expire in 15 minutes.
                    </p>
                    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #999999; text-align: center;">
                        This email was sent by PageForge. If you did not request a password reset, please ignore this email.
                    </p>
                </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(
                `[Mail Service]: Password reset email successfully sent to ${to}`,
            );
        } catch (error) {
            console.error(
                `[Mail Service Error]: Failed to send password reset email to ${to}`,
                error,
            );
            throw error;
        }
    }
}

