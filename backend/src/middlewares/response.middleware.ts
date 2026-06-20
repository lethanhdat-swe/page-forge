import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Response {
            success: (message: string, data?: unknown, statusCode?: number) => void;
            error: (
                message: string,
                errorDetails?: unknown,
                statusCode?: number,
                errorCode?: string | null,
            ) => void;
        }
    }
}

export const responseStandardizer = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    res.success = (
        message: string,
        data: unknown = null,
        statusCode: number = 200,
    ) => {
        res.status(statusCode).json({
            status: "success",
            message,
            data,
        });
    };

    res.error = (
        message: string,
        errorDetails: unknown = null,
        statusCode: number = 400,
        errorCode: string | null = null,
    ) => {
        res.status(statusCode).json({
            status: "error",
            errorCode,
            message,
            data: errorDetails,
        });
    };

    next();
};

