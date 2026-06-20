"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    errorCode;
    errors;
    constructor(message, statusCode = 400, errorCode = null, errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.errors = errors;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    console.error("[System Error]:", err);
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || "Internal server error";
    const errorCode = err instanceof AppError ? err.errorCode : null;
    const errors = err instanceof AppError ? err.errors : null;
    return res.error(message, errors, statusCode, errorCode);
};
exports.errorHandler = errorHandler;
