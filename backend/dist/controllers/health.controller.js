"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = void 0;
const getHealth = (req, res) => {
    res.success("PageForge server is running stably", {
        uptime: process.uptime(),
    });
};
exports.getHealth = getHealth;
