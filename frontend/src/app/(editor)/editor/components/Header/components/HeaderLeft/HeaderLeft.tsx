"use client";

import Link from "next/link";
import { ArrowLeft, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderLeftProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export function HeaderLeft({ sidebarOpen, setSidebarOpen }: HeaderLeftProps) {
    return (
        <div className="flex items-center gap-2">
            <Tooltip>
                <TooltipTrigger
                    render={
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            render={<Link href="/dashboard" />}
                            nativeButton={false}
                        >
                            <ArrowLeft className="size-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                    }
                />
                <TooltipContent side="bottom" align="start">
                    Back to Dashboard
                </TooltipContent>
            </Tooltip>

            <div className="h-4 w-[1px] bg-border mx-1" />

            <Tooltip>
                <TooltipTrigger
                    render={
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={
                                sidebarOpen
                                    ? "text-primary bg-muted"
                                    : "text-muted-foreground"
                            }
                        >
                            <PanelLeft className="size-4" />
                        </Button>
                    }
                />
                <TooltipContent side="bottom" align="start">
                    {sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                </TooltipContent>
            </Tooltip>
        </div>
    );
}
