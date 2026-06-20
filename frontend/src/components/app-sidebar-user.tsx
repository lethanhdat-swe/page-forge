"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Edit3,
    FileText,
    Image,
    Globe,
    CreditCard,
    Settings,
    Flame,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";

interface NavItem {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
    disabled?: boolean;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

const navSections: NavSection[] = [
    {
        title: "Workspace",
        items: [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                title: "Editor",
                url: "/editor",
                icon: Edit3,
            },
        ],
    },
    {
        title: "Site Features",
        items: [
            {
                title: "Pages",
                url: "#",
                icon: FileText,
                disabled: true,
            },
            {
                title: "Media Library",
                url: "#",
                icon: Image,
                disabled: true,
            },
            {
                title: "Custom Domains",
                url: "#",
                icon: Globe,
                disabled: true,
            },
        ],
    },
    {
        title: "Account & Billing",
        items: [
            {
                title: "Subscription",
                url: "/pricing",
                icon: CreditCard,
            },
            {
                title: "Settings",
                url: "#",
                icon: Settings,
                disabled: true,
            },
        ],
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();

    return (
        <Sidebar {...props}>
            <SidebarHeader className="border-b border-sidebar-border/50 py-4 px-4">
                <div className="flex items-center gap-3">
                    <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                        <Flame className="size-5 text-indigo-500 fill-indigo-500" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-semibold text-sm tracking-tight text-sidebar-foreground">
                            PageForge
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                            Creator Workspace
                        </span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="py-2">
                {navSections.map((section) => (
                    <SidebarGroup key={section.title}>
                        <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                            {section.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.url;
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            {item.disabled ? (
                                                <SidebarMenuButton
                                                    disabled
                                                    className="opacity-50 cursor-not-allowed w-full justify-between"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Icon className="size-4 shrink-0" />
                                                        <span>{item.title}</span>
                                                    </div>
                                                    <span className="text-[9px] font-semibold bg-sidebar-accent text-sidebar-accent-foreground px-1 py-0.5 rounded">
                                                        Soon
                                                    </span>
                                                </SidebarMenuButton>
                                            ) : (
                                                <SidebarMenuButton
                                                    isActive={isActive}
                                                    render={<Link href={item.url} />}
                                                >
                                                    <Icon className="size-4 shrink-0" />
                                                    <span>{item.title}</span>
                                                </SidebarMenuButton>
                                            )}
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
