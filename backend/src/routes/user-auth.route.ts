import { Router } from "express";
import {
    registerSchema,
    verifySchema,
    loginSchema,
    googleLoginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    refreshTokenSchema,
} from "../schemas/auth.schema";
import { validate } from "../middlewares/validate.middleware";
import {
    register,
    verify,
    login,
    loginWithGoogle,
    forgotPassword,
    resetPassword,
    refreshToken,
    logout,
} from "../controllers/user-auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/verify", validate(verifySchema), verify);
router.post("/login", validate(loginSchema), login);
router.post("/google", validate(googleLoginSchema), loginWithGoogle);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/refresh-token", validate(refreshTokenSchema), refreshToken);
router.post("/logout", validate(refreshTokenSchema), logout);

export default router;

