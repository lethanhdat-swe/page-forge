"use client";

import { Plus } from "lucide-react";

interface AddSectionButtonProps {
    onClick?: () => void;
}

export function AddSectionButton({ onClick }: AddSectionButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center gap-2.5 pl-[34px] pr-2.5 py-2 mt-1 rounded-md text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/5 active:bg-indigo-500/10 transition-all duration-200 cursor-pointer w-full text-left "
        >
            <div className="size-4 rounded-full border border-indigo-600 dark:border-indigo-400 flex items-center justify-center shrink-0">
                <Plus className="size-2.5 stroke-[2.5]" />
            </div>
            <span>Add section</span>
        </button>
    );
}
