"use client";

import { Box, ChevronRight } from "lucide-react";

interface SidebarItemProps {
    label: string;
}

export function SidebarItem({ label }: SidebarItemProps) {
    return (
        <div className="group flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-muted/50 transition-all duration-200 cursor-pointer w-full select-none">
            <Box className="size-3.5 text-muted-foreground/60 shrink-0" />

            <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground transition-colors select-none">
                {label}
            </span>
        </div>
    );
}
