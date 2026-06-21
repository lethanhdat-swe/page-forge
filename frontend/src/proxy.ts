import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface TokenPayload {
    id: string;
    email: string;
    role: "USER" | "ADMIN";
    exp?: number;
}

interface RouteGroup {
    type: "admin" | "user" | "guest-only";
    match: (pathname: string) => boolean;
}

const USER_KEYWORDS = [
    "/dashboard",
    "/editor",
    "/settings",
    "/profile",
    "/billing",
];

const GUEST_ONLY_PATHS = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/pricing",
];

const ROUTE_MATRIX: RouteGroup[] = [
    {
        type: "admin",
        match: (pathname: string) =>
            pathname === "/admin" || pathname.startsWith("/admin/"),
    },
    {
        type: "user",
        match: (pathname: string) =>
            USER_KEYWORDS.some(
                (kw) => pathname === kw || pathname.startsWith(kw + "/"),
            ),
    },
    {
        type: "guest-only",
        match: (pathname: string) =>
            GUEST_ONLY_PATHS.some(
                (path) => pathname === path || pathname.startsWith(path + "/"),
            ),
    },
];

function decodeJwt(token: string): TokenPayload | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        let base64Url = parts[1];
        let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const pad = base64.length % 4;
        if (pad) {
            base64 += "=".repeat(4 - pad);
        }

        const jsonStr = atob(base64);
        const payload = JSON.parse(jsonStr) as TokenPayload;

        if (payload.exp && Date.now() >= payload.exp * 1000) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

function getValidatedPayload(request: NextRequest): TokenPayload | null {
    const cookieNames = ["access_token", "accessToken", "token"];
    for (const name of cookieNames) {
        const cookie = request.cookies.get(name);
        if (cookie?.value) {
            const payload = decodeJwt(cookie.value);
            if (payload) return payload;
        }
    }
    return null;
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const host = request.headers.get("host") || "";
    const hostName = host.split(":")[0];

    const isBaseDomain =
        hostName === "localhost" || hostName === "pageforge.com";

    if (isBaseDomain) {
        const matchedRule = ROUTE_MATRIX.find((rule) => rule.match(pathname));

        if (matchedRule) {
            const payload = getValidatedPayload(request);

            if (matchedRule.type === "admin") {
                if (!payload) {
                    return NextResponse.redirect(
                        new URL("/login", request.url),
                    );
                }
                if (payload.role === "USER") {
                    return NextResponse.redirect(
                        new URL("/dashboard", request.url),
                    );
                }
                if (payload.role !== "ADMIN") {
                    return NextResponse.redirect(
                        new URL("/login", request.url),
                    );
                }
            } else if (matchedRule.type === "user") {
                if (!payload) {
                    return NextResponse.redirect(
                        new URL("/login", request.url),
                    );
                }
                if (payload.role === "ADMIN") {
                    return NextResponse.redirect(
                        new URL("/admin/dashboard", request.url),
                    );
                }
                if (payload.role !== "USER") {
                    return NextResponse.redirect(
                        new URL("/login", request.url),
                    );
                }
            } else if (matchedRule.type === "guest-only") {
                if (payload) {
                    const destination =
                        payload.role === "ADMIN"
                            ? "/admin/dashboard"
                            : "/dashboard";
                    return NextResponse.redirect(
                        new URL(destination, request.url),
                    );
                }
            }
        }

        return NextResponse.next();
    }

    const parts = hostName.split(".");
    let subdomain = "";

    if (hostName.endsWith("pageforge.com") && parts.length > 2) {
        subdomain = parts.slice(0, -2).join(".");
    } else if (parts.length > 1) {
        subdomain = parts.slice(0, -1).join(".");
    }

    if (subdomain && subdomain !== "www") {
        return NextResponse.rewrite(
            new URL(`/${subdomain}${pathname}`, request.url),
        );
    }

    return NextResponse.next();
}
