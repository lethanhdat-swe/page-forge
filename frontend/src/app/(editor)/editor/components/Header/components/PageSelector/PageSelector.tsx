"use client";

import { useState } from "react";
import { ChevronDown, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function PageSelector() {
    const [pages, setPages] = useState<string[]>([
        "Home",
        "About",
        "Pricing",
        "Contact",
    ]);
    const [selectedPage, setSelectedPage] = useState<string>("Home");

    const handleAddPage = () => {
        const newPageName = prompt("Enter new page name:");
        if (newPageName && newPageName.trim() !== "") {
            const trimmed = newPageName.trim();
            if (!pages.includes(trimmed)) {
                setPages([...pages, trimmed]);
                setSelectedPage(trimmed);
            }
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-4 gap-1.5 px-2.5 font-normal text-muted-foreground hover:text-foreground"
                    >
                        <FileText className="size-3.5 text-indigo-500" />
                        <span className="text-xs font-semibold text-foreground">
                            {selectedPage}
                        </span>
                        <ChevronDown className="size-3.5 opacity-50" />
                    </Button>
                }
            />
            <DropdownMenuContent align="start" className="w-48">
                {pages.map((page) => (
                    <DropdownMenuItem
                        key={page}
                        onClick={() => setSelectedPage(page)}
                        className={
                            selectedPage === page
                                ? "font-semibold text-indigo-600 bg-indigo-500/5 focus:bg-indigo-500/10 focus:text-indigo-600 dark:text-indigo-400 dark:focus:text-indigo-400"
                                : ""
                        }
                    >
                        <FileText className="size-3.5 mr-1" />
                        {page}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleAddPage}
                    className="text-indigo-600 focus:text-indigo-600 dark:text-indigo-400 dark:focus:text-indigo-400"
                >
                    <Plus className="size-3.5 mr-1" />
                    Create New Page
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
