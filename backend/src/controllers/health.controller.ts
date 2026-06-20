import { Request, Response } from "express";

export const getHealth = (req: Request, res: Response): void => {
    res.success("PageForge server is running stably", {
        uptime: process.uptime(),
    });
};
