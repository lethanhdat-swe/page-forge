import { Router } from "express";
import healthRouter from "./health.route";
import userAuthRouter from "./user-auth.route";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", userAuthRouter);

export default router;
