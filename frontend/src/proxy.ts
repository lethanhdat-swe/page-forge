import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
            new URL(`/(subdomain)/${subdomain}${pathname}`, request.url),
        );
    }

    return NextResponse.next();
}
