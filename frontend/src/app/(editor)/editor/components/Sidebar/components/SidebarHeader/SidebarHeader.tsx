"use client";

interface SidebarHeaderProps {
    title?: string;
}

export function SidebarHeader({ title = "Home page" }: SidebarHeaderProps) {
    return (
        <div className="px-5 py-4 border-b border-border bg-background flex items-center justify-between shrink-0 select-none">
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
                {title}
            </h2>
        </div>
    );
}
