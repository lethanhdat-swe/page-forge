"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar-user";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { DropdownMenuAvatar } from "@/components/UserDropdown/UserDropdown";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4">
                    <div className="flex h-full shrink-0 items-center">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/admin/dashboard">
                                        Admin
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {segments.map((segment, index) => {
                                    // Skip "admin" segment to avoid redundant "Admin > Admin > Dashboard"
                                    if (index === 0 && segment === "admin") {
                                        return null;
                                    }

                                    const label =
                                        segment.charAt(0).toUpperCase() +
                                        segment.slice(1);
                                    const isLast =
                                        index === segments.length - 1;
                                    const url =
                                        "/" +
                                        segments.slice(0, index + 1).join("/");

                                    return (
                                        <React.Fragment key={url}>
                                            <BreadcrumbSeparator className="hidden md:block" />
                                            <BreadcrumbItem>
                                                {isLast ? (
                                                    <BreadcrumbPage>
                                                        {label}
                                                    </BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink
                                                        href={url}
                                                        className="hidden md:block"
                                                    >
                                                        {label}
                                                    </BreadcrumbLink>
                                                )}
                                            </BreadcrumbItem>
                                        </React.Fragment>
                                    );
                                })}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <DropdownMenuAvatar />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
