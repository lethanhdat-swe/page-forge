import { httpClient } from "./client";

const isServer = typeof window === "undefined";

export const http = {
    get: (url: string, options?: RequestInit) => {
        if (isServer) {
            const { httpServer } = require("./server");
            return httpServer(url, { method: "GET", ...options });
        }
        return httpClient(url, { method: "GET", ...options });
    },

    post: (url: string, body: any, options?: RequestInit) => {
        const init = { method: "POST", body: JSON.stringify(body), ...options };
        if (isServer) {
            const { httpServer } = require("./server");
            return httpServer(url, init);
        }
        return httpClient(url, init);
    },

    put: (url: string, body: any, options?: RequestInit) => {
        const init = { method: "PUT", body: JSON.stringify(body), ...options };
        if (isServer) {
            const { httpServer } = require("./server");
            return httpServer(url, init);
        }
        return httpClient(url, init);
    },

    patch: (url: string, body: any, options?: RequestInit) => {
        const init = {
            method: "PATCH",
            body: JSON.stringify(body),
            ...options,
        };
        if (isServer) {
            const { httpServer } = require("./server");
            return httpServer(url, init);
        }
        return httpClient(url, init);
    },

    delete: (url: string, options?: RequestInit) => {
        if (isServer) {
            const { httpServer } = require("./server");
            return httpServer(url, { method: "DELETE", ...options });
        }
        return httpClient(url, { method: "DELETE", ...options });
    },
};
