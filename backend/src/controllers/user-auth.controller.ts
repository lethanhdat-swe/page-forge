import { Request, Response, NextFunction } from "express";
import { UserAuthService } from "../services/user-auth.service";

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        await UserAuthService.register(req.body);
        res.success("User registered successfully. Verification email sent.", null, 201);
    } catch (error) {
        next(error);
    }
};

export const verify = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { token } = req.body;
        const result = await UserAuthService.verify(token);
        res.success("Email verified successfully.", result, 200);
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const result = await UserAuthService.login(req.body);
        res.success("Login successful.", result, 200);
    } catch (error) {
        next(error);
    }
};

export const loginWithGoogle = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { idToken } = req.body;
        const result = await UserAuthService.loginWithGoogle(idToken);
        res.success("Login successful.", result, 200);
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { email } = req.body;
        await UserAuthService.forgotPassword(email);
        res.success("Password reset email sent successfully.", null, 200);
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { token, newPassword } = req.body;
        const result = await UserAuthService.resetPassword(token, newPassword);
        res.success("Password reset successfully.", result, 200);
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        const result = await UserAuthService.refreshToken(refreshToken);
        res.success("Token refreshed successfully.", result, 200);
    } catch (error) {
        next(error);
    }
};

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        await UserAuthService.logout(refreshToken);
        res.success("Logged out successfully.", null, 200);
    } catch (error) {
        next(error);
    }
};


