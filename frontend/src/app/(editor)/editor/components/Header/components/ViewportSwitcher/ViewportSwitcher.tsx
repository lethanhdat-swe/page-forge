"use client";

import { Monitor, Tablet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export type ViewportType = "desktop" | "tablet" | "mobile";

interface ViewportSwitcherProps {
    viewport: ViewportType;
    setViewport: (viewport: ViewportType) => void;
}

export function ViewportSwitcher({ viewport, setViewport }: ViewportSwitcherProps) {
    return (
        <div className="flex items-center bg-muted/50 p-0.5 rounded-lg border border-border/50">
            <Tooltip>
                <TooltipTrigger
                    render={
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setViewport("desktop")}
                            className={
                                viewport === "desktop"
                                    ? "bg-background text-foreground shadow-xs font-semibold"
                                    : "text-muted-foreground"
                            }
                        >
                            <Monitor className="size-4" />
                        </Button>
                    }
                />
                <TooltipContent side="bottom">Desktop View</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger
                    render={
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setViewport("tablet")}
                            className={
                                viewport === "tablet"
                                    ? "bg-background text-foreground shadow-xs font-semibold"
                                    : "text-muted-foreground"
                            }
                        >
                            <Tablet className="size-4" />
                        </Button>
                    }
                />
                <TooltipContent side="bottom">Tablet View</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger
                    render={
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setViewport("mobile")}
                            className={
                                viewport === "mobile"
                                    ? "bg-background text-foreground shadow-xs font-semibold"
                                    : "text-muted-foreground"
                            }
                        >
                            <Smartphone className="size-4" />
                        </Button>
                    }
                />
                <TooltipContent side="bottom">Mobile View</TooltipContent>
            </Tooltip>
        </div>
    );
}
