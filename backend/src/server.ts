import dotenv from "dotenv";
// 1. Load env variables first
dotenv.config();

import { connectPrisma } from "./config/prisma";
// 2. Initialize Prisma connection immediately before importing routers/services
connectPrisma();

// 3. Now safely import the rest of your application components
import express, { Express } from "express";
import cors from "cors";
import { responseStandardizer } from "./middlewares/response.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import router from "./routes";

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(responseStandardizer);

app.use("/api", router);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
