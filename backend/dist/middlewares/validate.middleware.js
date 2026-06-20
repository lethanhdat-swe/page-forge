"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const error_code_constant_1 = require("../constants/error-code.constant");
// Use ZodObject to validate the request schema
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const formattedErrors = error.issues.map((err) => ({
                    field: err.path.join(".").replace("body.", ""),
                    message: err.message,
                }));
                res.error("Invalid input data", formattedErrors, 400, error_code_constant_1.ErrorCode.VALIDATION_ERROR);
                return;
            }
            next(error);
        }
    };
};
exports.validate = validate;
