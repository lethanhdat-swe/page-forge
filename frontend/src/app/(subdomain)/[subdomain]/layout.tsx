import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

interface SubdomainLayoutProps {
    children: ReactNode;
}

export default async function SubdomainLayout({
    children,
}: SubdomainLayoutProps) {
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const hostName = host.split(":")[0];

    console.log(hostName);

    const isBaseDomain =
        hostName === "localhost" || hostName === "pageforge.com";

    if (isBaseDomain) {
        notFound();
    }

    return <>{children}</>;
}
