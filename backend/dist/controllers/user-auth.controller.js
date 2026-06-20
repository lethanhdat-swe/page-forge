"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.resetPassword = exports.forgotPassword = exports.loginWithGoogle = exports.login = exports.verify = exports.register = void 0;
const user_auth_service_1 = require("../services/user-auth.service");
const register = async (req, res, next) => {
    try {
        await user_auth_service_1.UserAuthService.register(req.body);
        res.success("User registered successfully. Verification email sent.", null, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const verify = async (req, res, next) => {
    try {
        const { token } = req.body;
        const result = await user_auth_service_1.UserAuthService.verify(token);
        res.success("Email verified successfully.", result, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.verify = verify;
const login = async (req, res, next) => {
    try {
        const result = await user_auth_service_1.UserAuthService.login(req.body);
        res.success("Login successful.", result, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const loginWithGoogle = async (req, res, next) => {
    try {
        const { idToken } = req.body;
        const result = await user_auth_service_1.UserAuthService.loginWithGoogle(idToken);
        res.success("Login successful.", result, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.loginWithGoogle = loginWithGoogle;
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        await user_auth_service_1.UserAuthService.forgotPassword(email);
        res.success("Password reset email sent successfully.", null, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        const result = await user_auth_service_1.UserAuthService.resetPassword(token, newPassword);
        res.success("Password reset successfully.", result, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const result = await user_auth_service_1.UserAuthService.refreshToken(refreshToken);
        res.success("Token refreshed successfully.", result, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        await user_auth_service_1.UserAuthService.logout(refreshToken);
        res.success("Logged out successfully.", null, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
