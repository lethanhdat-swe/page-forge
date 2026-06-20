"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const error_code_constant_1 = require("../constants/error-code.constant");
const ipCache = new Map();
const rateLimiter = (limit = 60, windowMs = 60000) => {
    return (req, res, next) => {
        const ip = req.ip || req.socket.remoteAddress || "unknown";
        const now = Date.now();
        const record = ipCache.get(ip);
        if (!record || now > record.resetTime) {
            ipCache.set(ip, { count: 1, resetTime: now + windowMs });
            return next();
        }
        record.count++;
        if (record.count > limit) {
            res.error("Too many requests. Please try again later.", null, 429, error_code_constant_1.ErrorCode.RATE_LIMIT_ERROR);
            return;
        }
        next();
    };
};
exports.rateLimiter = rateLimiter;
