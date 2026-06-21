"use client";

import { Check, Undo2, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface SaveActionsProps {
    isSaving: boolean;
    onSave: () => void;
}

export function SaveActions({ isSaving, onSave }: SaveActionsProps) {
    return (
        <div className="flex items-center gap-2">
            <Tooltip>
                <TooltipTrigger
                    render={
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground"
                        >
                            <Undo2 className="size-4" />
                        </Button>
                    }
                />
                <TooltipContent side="bottom">Undo</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger
                    render={
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground"
                        >
                            <Redo2 className="size-4" />
                        </Button>
                    }
                />
                <TooltipContent side="bottom">Redo</TooltipContent>
            </Tooltip>

            <div className="h-4 w-[1px] bg-border mx-1" />

            <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                disabled={isSaving}
            >
                <Check className="size-3.5 mr-1" />
                {isSaving ? "Saving..." : "Save"}
            </Button>
        </div>
    );
}
