"use client";

import { useState } from "react";
import { HeaderLeft } from "./components/HeaderLeft/HeaderLeft";
import {
    ViewportSwitcher,
    type ViewportType,
} from "./components/ViewportSwitcher/ViewportSwitcher";
import { PageSelector } from "./components/PageSelector/PageSelector";
import { SaveActions } from "./components/SaveActions/SaveActions";
import { usePageStore } from "@/store/PageStore";

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
    const currentDevice = usePageStore((state) => state.currentDevice);
    const setDevice = usePageStore((state) => state.setDevice);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 800);
    };

    return (
        <header className="h-14 border-b border-border bg-background px-4 flex items-center justify-between z-30 w-full shrink-0 select-none">
            <HeaderLeft
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
            <div className="flex items-center gap-4">
                <ViewportSwitcher
                    viewport={currentDevice}
                    setViewport={setDevice}
                />
                <PageSelector />
            </div>
            <SaveActions isSaving={isSaving} onSave={handleSave} />
        </header>
    );
}
