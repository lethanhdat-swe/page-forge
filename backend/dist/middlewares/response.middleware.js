"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseStandardizer = void 0;
const responseStandardizer = (req, res, next) => {
    res.success = (message, data = null, statusCode = 200) => {
        res.status(statusCode).json({
            status: "success",
            message,
            data,
        });
    };
    res.error = (message, errorDetails = null, statusCode = 400, errorCode = null) => {
        res.status(statusCode).json({
            status: "error",
            errorCode,
            message,
            data: errorDetails,
        });
    };
    next();
};
exports.responseStandardizer = responseStandardizer;
