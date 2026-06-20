import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AppError } from "../middlewares/error.middleware";
import { ErrorCode } from "../constants/error-code.constant";
import { TokenType } from "@prisma/client";
import { prisma } from "../config/prisma";
import { MailService } from "./mail.service";
import { firebaseAdmin } from "../config/firebase";

export interface RegisterDto {
    email: string;
    password?: string;
    username: string;
}

export interface LoginDto {
    email: string;
    password?: string;
}

export interface UserResponse {
    id: string;
    email: string;
    username: string;
    role: string;
    isVerified: boolean;
    createdAt: Date;
}

export type RegisterResult = void;

export interface LoginResult {
    accessToken: string;
    refreshToken: string;
    user: UserResponse;
}

export class UserAuthService {
    public static async register(dto: RegisterDto): Promise<RegisterResult> {
        const { email, password, username } = dto;

        if (!password) {
            throw new AppError(
                "Password is required",
                400,
                ErrorCode.BAD_REQUEST,
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new AppError(
                "A user with this email already exists",
                400,
                ErrorCode.AUTH_EMAIL_EXISTS,
            );
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const tokenString = crypto.randomBytes(32).toString("hex");

        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    username,
                    isVerified: false,
                },
            });

            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry
            await tx.token.create({
                data: {
                    token: tokenString,
                    type: TokenType.VERIFICATION,
                    expiresAt,
                    userId: user.id,
                },
            });
        });

        await MailService.sendVerificationEmail(email, tokenString);
    }

    public static async verify(token: string): Promise<LoginResult> {
        const tokenRecord = await prisma.token.findUnique({
            where: { token },
        });

        if (!tokenRecord || tokenRecord.type !== TokenType.VERIFICATION) {
            throw new AppError(
                "Invalid verification token",
                400,
                ErrorCode.AUTH_TOKEN_INVALID,
            );
        }

        if (tokenRecord.expiresAt < new Date()) {
            throw new AppError(
                "Verification token has expired",
                400,
                ErrorCode.AUTH_TOKEN_EXPIRED,
            );
        }

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id: tokenRecord.userId },
                data: { isVerified: true },
            });

            await tx.token.delete({
                where: { id: tokenRecord.id },
            });

            const refreshToken = crypto.randomBytes(40).toString("hex");
            const refreshTokenExpiresAt = new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000,
            );

            await tx.token.create({
                data: {
                    token: refreshToken,
                    type: TokenType.REFRESH,
                    expiresAt: refreshTokenExpiresAt,
                    userId: user.id,
                },
            });

            return {
                user,
                refreshToken,
            };
        });

        const jwtSecret =
            process.env.JWT_SECRET ||
            "super_secret_key_change_me_in_production";
        const accessToken = jwt.sign(
            {
                id: result.user.id,
                email: result.user.email,
                role: result.user.role,
            },
            jwtSecret,
            { expiresIn: "15m" },
        );

        return {
            accessToken,
            refreshToken: result.refreshToken,
            user: {
                id: result.user.id,
                email: result.user.email,
                username: result.user.username,
                role: result.user.role,
                isVerified: result.user.isVerified,
                createdAt: result.user.createdAt,
            },
        };
    }

    public static async login(dto: LoginDto): Promise<LoginResult> {
        const { email, password } = dto;

        if (!password) {
            throw new AppError(
                "Password is required",
                400,
                ErrorCode.BAD_REQUEST,
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AppError(
                "Invalid email or password",
                401,
                ErrorCode.AUTH_INVALID_CREDENTIALS,
            );
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppError(
                "Invalid email or password",
                401,
                ErrorCode.AUTH_INVALID_CREDENTIALS,
            );
        }

        if (!user.isVerified) {
            throw new AppError(
                "Your email is not verified. Please check your verification token.",
                403,
                ErrorCode.AUTH_USER_NOT_VERIFIED,
            );
        }

        const result = await prisma.$transaction(async (tx) => {
            const refreshToken = crypto.randomBytes(40).toString("hex");
            const refreshTokenExpiresAt = new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000,
            );

            await tx.token.create({
                data: {
                    token: refreshToken,
                    type: TokenType.REFRESH,
                    expiresAt: refreshTokenExpiresAt,
                    userId: user.id,
                },
            });

            return {
                refreshToken,
            };
        });

        const jwtSecret =
            process.env.JWT_SECRET ||
            "super_secret_key_change_me_in_production";
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            jwtSecret,
            { expiresIn: "15m" },
        );

        return {
            accessToken,
            refreshToken: result.refreshToken,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
            },
        };
    }

    public static async loginWithGoogle(idToken: string): Promise<LoginResult> {
        let decodedToken;
        try {
            decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        } catch (error: any) {
            throw new AppError(
                "Invalid or expired Google ID token",
                401,
                ErrorCode.AUTH_TOKEN_INVALID,
                error.message,
            );
        }

        const email = decodedToken.email;
        if (!email) {
            throw new AppError(
                "Google ID token does not contain an email address",
                400,
                ErrorCode.BAD_REQUEST,
            );
        }

        const name = decodedToken.name || "";

        const result = await prisma.$transaction(async (tx) => {
            let user = await tx.user.findUnique({
                where: { email },
            });

            if (!user) {
                const randomPassword = crypto.randomBytes(32).toString("hex");
                const hashedPassword = await bcryptjs.hash(randomPassword, 10);
                const username = name || email.split("@")[0];

                user = await tx.user.create({
                    data: {
                        email,
                        username,
                        password: hashedPassword,
                        isVerified: true,
                    },
                });
            } else if (!user.isVerified) {
                user = await tx.user.update({
                    where: { id: user.id },
                    data: { isVerified: true },
                });
            }

            const refreshToken = crypto.randomBytes(40).toString("hex");
            const refreshTokenExpiresAt = new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000,
            );

            await tx.token.create({
                data: {
                    token: refreshToken,
                    type: TokenType.REFRESH,
                    expiresAt: refreshTokenExpiresAt,
                    userId: user.id,
                },
            });

            return {
                user,
                refreshToken,
            };
        });

        const jwtSecret =
            process.env.JWT_SECRET ||
            "super_secret_key_change_me_in_production";
        const accessToken = jwt.sign(
            {
                id: result.user.id,
                email: result.user.email,
                role: result.user.role,
            },
            jwtSecret,
            { expiresIn: "15m" },
        );

        return {
            accessToken,
            refreshToken: result.refreshToken,
            user: {
                id: result.user.id,
                email: result.user.email,
                username: result.user.username,
                role: result.user.role,
                isVerified: result.user.isVerified,
                createdAt: result.user.createdAt,
            },
        };
    }

    public static async forgotPassword(email: string): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AppError(
                "User with this email does not exist",
                404,
                ErrorCode.NOT_FOUND,
            );
        }

        const tokenString = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await prisma.token.create({
            data: {
                token: tokenString,
                type: TokenType.PASSWORD_RESET,
                expiresAt,
                userId: user.id,
            },
        });

        await MailService.sendPasswordResetEmail(email, tokenString);
    }

    public static async resetPassword(
        token: string,
        newPassword: string,
    ): Promise<LoginResult> {
        const tokenRecord = await prisma.token.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!tokenRecord || tokenRecord.type !== TokenType.PASSWORD_RESET) {
            throw new AppError(
                "Invalid password reset token",
                400,
                ErrorCode.AUTH_TOKEN_INVALID,
            );
        }

        if (tokenRecord.expiresAt < new Date()) {
            throw new AppError(
                "Password reset token has expired",
                400,
                ErrorCode.AUTH_TOKEN_EXPIRED,
            );
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        const result = await prisma.$transaction(async (tx) => {
            const updatedUser = await tx.user.update({
                where: { id: tokenRecord.userId },
                data: { password: hashedPassword },
            });

            await tx.token.deleteMany({
                where: { userId: tokenRecord.userId },
            });

            const refreshToken = crypto.randomBytes(40).toString("hex");
            const refreshTokenExpiresAt = new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000,
            );

            await tx.token.create({
                data: {
                    token: refreshToken,
                    type: TokenType.REFRESH,
                    expiresAt: refreshTokenExpiresAt,
                    userId: updatedUser.id,
                },
            });

            return {
                user: updatedUser,
                refreshToken,
            };
        });

        const jwtSecret =
            process.env.JWT_SECRET ||
            "super_secret_key_change_me_in_production";
        const accessToken = jwt.sign(
            {
                id: result.user.id,
                email: result.user.email,
                role: result.user.role,
            },
            jwtSecret,
            { expiresIn: "15m" },
        );

        return {
            accessToken,
            refreshToken: result.refreshToken,
            user: {
                id: result.user.id,
                email: result.user.email,
                username: result.user.username,
                role: result.user.role,
                isVerified: result.user.isVerified,
                createdAt: result.user.createdAt,
            },
        };
    }

    public static async refreshToken(refreshToken: string): Promise<LoginResult> {
        const tokenRecord = await prisma.token.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });

        if (!tokenRecord || tokenRecord.type !== TokenType.REFRESH) {
            throw new AppError(
                "Invalid refresh token",
                400,
                ErrorCode.AUTH_TOKEN_INVALID,
            );
        }

        if (tokenRecord.expiresAt < new Date()) {
            await prisma.token.delete({
                where: { id: tokenRecord.id },
            }).catch(() => {});
            throw new AppError(
                "Refresh token has expired",
                400,
                ErrorCode.AUTH_TOKEN_EXPIRED,
            );
        }

        const newRefreshToken = crypto.randomBytes(40).toString("hex");
        const newRefreshTokenExpiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
        );

        await prisma.$transaction(async (tx) => {
            await tx.token.delete({
                where: { id: tokenRecord.id },
            });

            await tx.token.create({
                data: {
                    token: newRefreshToken,
                    type: TokenType.REFRESH,
                    expiresAt: newRefreshTokenExpiresAt,
                    userId: tokenRecord.userId,
                },
            });
        });

        const jwtSecret =
            process.env.JWT_SECRET ||
            "super_secret_key_change_me_in_production";
        const accessToken = jwt.sign(
            {
                id: tokenRecord.user.id,
                email: tokenRecord.user.email,
                role: tokenRecord.user.role,
            },
            jwtSecret,
            { expiresIn: "15m" },
        );

        return {
            accessToken,
            refreshToken: newRefreshToken,
            user: {
                id: tokenRecord.user.id,
                email: tokenRecord.user.email,
                username: tokenRecord.user.username,
                role: tokenRecord.user.role,
                isVerified: tokenRecord.user.isVerified,
                createdAt: tokenRecord.user.createdAt,
            },
        };
    }

    public static async logout(refreshToken: string): Promise<void> {
        await prisma.token.deleteMany({
            where: {
                token: refreshToken,
                type: TokenType.REFRESH,
            },
        });
    }
}
