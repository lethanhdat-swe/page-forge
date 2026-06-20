"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectPrisma = connectPrisma;
const client_1 = require("@prisma/client");
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Keep it internal as a pointer reference
let prismaInstance;
function connectPrisma() {
    if (prismaInstance) {
        return prismaInstance;
    }
    const url = process.env.DATABASE_URL;
    if (!url) {
        throw new Error("DATABASE_URL is required at runtime (set in .env)");
    }
    const adapter = new adapter_mariadb_1.PrismaMariaDb(url);
    prismaInstance = new client_1.PrismaClient({ adapter });
    return prismaInstance;
}
// Export a Proxy that acts exactly like PrismaClient but dynamically accesses the runtime instance
exports.prisma = new Proxy({}, {
    get(_, prop) {
        if (!prismaInstance) {
            throw new Error("PrismaClient has not been initialized yet. Ensure connectPrisma() is called at application startup (server.ts).");
        }
        return Reflect.get(prismaInstance, prop);
    },
});
