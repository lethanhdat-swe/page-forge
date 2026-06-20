"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const error_middleware_1 = require("../middlewares/error.middleware");
const error_code_constant_1 = require("../constants/error-code.constant");
const client_1 = require("@prisma/client");
const prisma_1 = require("../config/prisma");
const mail_service_1 = require("./mail.service");
const firebase_1 = require("../config/firebase");
class UserAuthService {
    static async register(dto) {
        const { email, password, username } = dto;
        if (!password) {
            throw new error_middleware_1.AppError("Password is required", 400, error_code_constant_1.ErrorCode.BAD_REQUEST);
        }
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new error_middleware_1.AppError("A user with this email already exists", 400, error_code_constant_1.ErrorCode.AUTH_EMAIL_EXISTS);
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const tokenString = crypto_1.default.randomBytes(32).toString("hex");
        await prisma_1.prisma.$transaction(async (tx) => {
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
                    type: client_1.TokenType.VERIFICATION,
                    expiresAt,
                    userId: user.id,
                },
            });
        });
        await mail_service_1.MailService.sendVerificationEmail(email, tokenString);
    }
    static async verify(token) {
        const tokenRecord = await prisma_1.prisma.token.findUnique({
            where: { token },
        });
        if (!tokenRecord || tokenRecord.type !== client_1.TokenType.VERIFICATION) {
            throw new error_middleware_1.AppError("Invalid verification token", 400, error_code_constant_1.ErrorCode.AUTH_TOKEN_INVALID);
        }
        if (tokenRecord.expiresAt < new Date()) {
            throw new error_middleware_1.AppError("Verification token has expired", 400, error_code_constant_1.ErrorCode.AUTH_TOKEN_EXPIRED);
        }
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id: tokenRecord.userId },
                data: { isVerified: true },
            });
            await tx.token.delete({
                where: { id: tokenRecord.id },
            });
            const refreshToken = crypto_1.default.randomBytes(40).toString("hex");
            const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await tx.token.create({
                data: {
                    token: refreshToken,
                    type: client_1.TokenType.REFRESH,
                    expiresAt: refreshTokenExpiresAt,
                    userId: user.id,
                },
            });
            return {
                user,
                refreshToken,
            };
        });
        const jwtSecret = process.env.JWT_SECRET ||
            "super_secret_key_change_me_in_production";
        const accessToken = jsonwebtoken_1.default.sign({
            id: result.user.id,
            email: result.user.email,
            role: result.user.role,
        }, jwtSecret, { expiresIn: "15m" });
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
    static async login(dto) {
        const { email, password } = dto;
        if (!password) {
            throw new error_middleware_1.AppError("Password is required", 400, error_code_constant_1.ErrorCode.BAD_REQUEST);
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new error_middleware_1.AppError("Invalid email or password", 401, error_code_constant_1.ErrorCode.AUTH_INVALID_CREDENTIALS);
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new error_middleware_1.AppError("Invalid email or password", 401, error_code_constant_1.ErrorCode.AUTH_INVALID_CREDENTIALS);
        }
        if (!user.isVerified) {
            throw new error_middleware_1.AppError("Your email is not verified. Please check your verification token.", 403, error_code_constant_1.ErrorCode.AUTH_USER_NOT_VERIFIED);
        }
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            const refreshToken = crypto_1.default.randomBytes(40).toString("hex");
            const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await tx.token.create({
                data: {
                    token: refreshToken,
                    type: client_1.TokenType.REFRESH,
                    expiresAt: refreshTokenExpiresAt,
                    userId: user.id,
                },
            });
            return {
                refreshToken,
            };
        });
        const jwtSecret = process.env.JWT_SECRET ||
            "super_secret_key_change_me_in_production";
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: "15m" });
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
    static async loginWithGoogle(idToken) {
        let decodedToken;
        try {
            decodedToken = await firebase_1.firebaseAdmin.auth().verifyIdToken(idToken);
        }
        catch (error) {
            throw new error_middleware_1.AppError("Invalid or expired Google ID token", 401, error_code_constant_1.ErrorCode.AUTH_TOKEN_INVALID, error.message);
        }
        const email = decodedToken.email;
        if (!email) {
            throw new error_middleware_1.AppError("Google ID token does not contain an email address", 400, error_code_constant_1.ErrorCode.BAD_REQUEST);
        }
        const name = decodedToken.name || "";
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            let user = await tx.user.findUnique({
                where: { email },
            });
            if (!user) {
                const randomPassword = crypto_1.default.randomBytes(32).toString("hex");
                const hashedPassword = await bcryptjs_1.default.hash(randomPassword, 10);
                const username = name || email.split("@")[0];
                user = await tx.user.create({
                    data: {
                        email,
                        username,
                        password: hashedPassword,
                        isVerified: true,
                    },
                });
            }
            else if (!user.isVerified) {
                user = await tx.user.update({
                    where: { id: user.id },
                    data: { isVerified: true },
                });
            }
            const refreshToken = crypto_1.default.randomBytes(40).toString("hex");
            const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await tx.token.create({
                data: {
                    token: refreshToken,
                    type: client_1.TokenType.REFRESH,
                    expiresAt: refreshTokenExpiresAt,
                    userId: user.id,
                },
            });
            return {
                user,
                refreshToken,
            };
        });
        const jwtSecret = process.env.JWT_SECRET ||
            "super_secret_key_change_me_in_production";
        const accessToken = jsonwebtoken_1.default.sign({
            id: result.user.id,
            email: result.user.email,
            role: result.user.role,
        }, jwtSecret, { expiresIn: "15m" });
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
    static async forgotPassword(email) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new error_middleware_1.AppError("User with this email does not exist", 404, error_code_constant_1.ErrorCode.NOT_FOUND);
        }
        const tokenString = crypto_1.default.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        await prisma_1.prisma.token.create({
            data: {
                token: tokenString,
                type: client_1.TokenType.PASSWORD_RESET,
                expiresAt,
                userId: user.id,
            },
        });
        await mail_service_1.MailService.sendPasswordResetEmail(email, tokenString);
    }
    static async resetPassword(token, newPassword) {
        const tokenRecord = await prisma_1.prisma.token.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!tokenRecord || tokenRecord.type !== client_1.TokenType.PASSWORD_RESET) {
            throw new error_middleware_1.AppError("Invalid password reset token", 400, error_code_constant_1.ErrorCode.AUTH_TOKEN_INVALID);
        }
        if (tokenRecord.expiresAt < new Date()) {
            throw new error_middleware_1.AppError("Password reset token has expired", 400, error_code_constant_1.ErrorCode.AUTH_TOKEN_EXPIRED);
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            const updatedUser = await tx.user.update({
                where: { id: tokenRecord.userId },
                data: { password: hashedPassword },
            });
            await tx.token.deleteMany({
                where: { userId: tokenRecord.userId },
            });
            const refreshToken = crypto_1.default.randomBytes(40).toString("hex");
            const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await tx.token.create({
                data: {
                    token: refreshToken,
                    type: client_1.TokenType.REFRESH,
                    expiresAt: refreshTokenExpiresAt,
                    userId: updatedUser.id,
                },
            });
            return {
                user: updatedUser,
                refreshToken,
            };
        });
        const jwtSecret = process.env.JWT_SECRET ||
            "super_secret_key_change_me_in_production";
        const accessToken = jsonwebtoken_1.default.sign({
            id: result.user.id,
            email: result.user.email,
            role: result.user.role,
        }, jwtSecret, { expiresIn: "15m" });
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
    static async refreshToken(refreshToken) {
        const tokenRecord = await prisma_1.prisma.token.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });
        if (!tokenRecord || tokenRecord.type !== client_1.TokenType.REFRESH) {
            throw new error_middleware_1.AppError("Invalid refresh token", 400, error_code_constant_1.ErrorCode.AUTH_TOKEN_INVALID);
        }
        if (tokenRecord.expiresAt < new Date()) {
            await prisma_1.prisma.token.delete({
                where: { id: tokenRecord.id },
            }).catch(() => { });
            throw new error_middleware_1.AppError("Refresh token has expired", 400, error_code_constant_1.ErrorCode.AUTH_TOKEN_EXPIRED);
        }
        const newRefreshToken = crypto_1.default.randomBytes(40).toString("hex");
        const newRefreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await prisma_1.prisma.$transaction(async (tx) => {
            await tx.token.delete({
                where: { id: tokenRecord.id },
            });
            await tx.token.create({
                data: {
                    token: newRefreshToken,
                    type: client_1.TokenType.REFRESH,
                    expiresAt: newRefreshTokenExpiresAt,
                    userId: tokenRecord.userId,
                },
            });
        });
        const jwtSecret = process.env.JWT_SECRET ||
            "super_secret_key_change_me_in_production";
        const accessToken = jsonwebtoken_1.default.sign({
            id: tokenRecord.user.id,
            email: tokenRecord.user.email,
            role: tokenRecord.user.role,
        }, jwtSecret, { expiresIn: "15m" });
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
    static async logout(refreshToken) {
        await prisma_1.prisma.token.deleteMany({
            where: {
                token: refreshToken,
                type: client_1.TokenType.REFRESH,
            },
        });
    }
}
exports.UserAuthService = UserAuthService;
