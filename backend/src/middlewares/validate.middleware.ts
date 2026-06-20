import { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject } from "zod";
import { ErrorCode } from "../constants/error-code.constant";

// Use ZodObject to validate the request schema
export const validate = (schema: ZodObject) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.issues.map((err) => ({
                    field: err.path.join(".").replace("body.", ""),
                    message: err.message,
                }));

                res.error(
                    "Invalid input data",
                    formattedErrors,
                    400,
                    ErrorCode.VALIDATION_ERROR,
                );
                return;
            }
            next(error);
        }
    };
};

