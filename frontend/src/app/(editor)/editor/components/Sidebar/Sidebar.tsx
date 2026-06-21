"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SidebarHeader } from "./components/SidebarHeader/SidebarHeader";
import { SidebarItem } from "./components/SidebarItem/SidebarItem";
import { AddSectionButton } from "./components/AddSectionButton/AddSectionButton";

interface SidebarProps {
    isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
    const [sections, setSections] = useState<string[]>([
        "Announcement bar",
        "Header",
    ]);

    const handleAddSection = () => {
        const name = prompt("Enter section name:");
        if (name && name.trim() !== "") {
            setSections([...sections, name.trim()]);
        }
    };

    return (
        <aside
            className={cn(
                "border-r border-border bg-background flex flex-col h-full transition-all duration-300 ease-in-out shrink-0 overflow-hidden",
                isOpen ? "w-[280px]" : "w-0 border-r-0",
            )}
        >
            <div className="flex flex-col h-full w-[280px]">
                <SidebarHeader title="Home page" />
                <div className="flex-1 overflow-y-auto py-2">
                    {sections.map((section, idx) => (
                        <SidebarItem key={idx} label={section} />
                    ))}
                    <AddSectionButton onClick={handleAddSection} />
                </div>
            </div>
        </aside>
    );
}
