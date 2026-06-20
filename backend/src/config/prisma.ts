import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import dotenv from "dotenv";

dotenv.config();

// Keep it internal as a pointer reference
let prismaInstance: PrismaClient | undefined;

export function connectPrisma(): PrismaClient {
    if (prismaInstance) {
        return prismaInstance;
    }

    const url = process.env.DATABASE_URL;
    if (!url) {
        throw new Error("DATABASE_URL is required at runtime (set in .env)");
    }

    const adapter = new PrismaMariaDb(url);
    prismaInstance = new PrismaClient({ adapter });

    return prismaInstance;
}

// Export a Proxy that acts exactly like PrismaClient but dynamically accesses the runtime instance
export const prisma = new Proxy({} as PrismaClient, {
    get(_, prop) {
        if (!prismaInstance) {
            throw new Error(
                "PrismaClient has not been initialized yet. Ensure connectPrisma() is called at application startup (server.ts).",
            );
        }
        return Reflect.get(prismaInstance, prop);
    },
});
