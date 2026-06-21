"use client";

import { useState } from "react";
import Header from "@/app/(editor)/editor/components/Header/Header";
import Preview from "@/app/(editor)/editor/components/Preview/Preview";
import Sidebar from "@/app/(editor)/editor/components/Sidebar/Sidebar";
import { usePageStore } from "@/store/PageStore";

export default function EditorPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const currentDevice = usePageStore((state) => state.currentDevice);

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="flex flex-1 overflow-hidden relative w-full">
                <Sidebar isOpen={sidebarOpen} />
                <Preview
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    currentDevice={currentDevice}
                />
            </main>
        </div>
    );
}

