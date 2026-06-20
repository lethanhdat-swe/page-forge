import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
    public statusCode: number;
    public errorCode: string | null;
    public errors: unknown;

    constructor(
        message: string,
        statusCode: number = 400,
        errorCode: string | null = null,
        errors: unknown = null,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.errors = errors;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.error("[System Error]:", err);

    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || "Internal server error";
    const errorCode = err instanceof AppError ? err.errorCode : null;
    const errors = err instanceof AppError ? err.errors : null;

    return res.error(message, errors, statusCode, errorCode);
};

