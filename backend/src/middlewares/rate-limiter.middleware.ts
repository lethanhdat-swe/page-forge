import { Request, Response, NextFunction } from "express";
import { ErrorCode } from "../constants/error-code.constant";

const ipCache = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (limit: number = 60, windowMs: number = 60000) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const ip = req.ip || req.socket.remoteAddress || "unknown";
        const now = Date.now();

        const record = ipCache.get(ip);

        if (!record || now > record.resetTime) {
            ipCache.set(ip, { count: 1, resetTime: now + windowMs });
            return next();
        }

        record.count++;

        if (record.count > limit) {
            res.error(
                "Too many requests. Please try again later.",
                null,
                429,
                ErrorCode.RATE_LIMIT_ERROR,
            );
            return;
        }

        next();
    };
};
