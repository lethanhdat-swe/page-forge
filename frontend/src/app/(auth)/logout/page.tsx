"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/AuthStore";

export default function LogoutPage() {
    const router = useRouter();
    const clearAuth = useAuthStore((state) => state.clearAuth);

    useEffect(() => {
        const performAbsoluteCleanup = () => {
            // 1. Clear Zustand global client state
            clearAuth();

            // 2. Explicitly remove cookies from the browser runtime
            Cookies.remove("access_token", { path: "/" });
            Cookies.remove("refresh_token", { path: "/" });

            // 3. Final redirection to the login interface
            router.replace("/login");
        };

        performAbsoluteCleanup();
    }, [clearAuth, router]);

    // Keep it blank or show a minimalist loader/spinner matching your theme
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
            <p className="text-sm font-mono tracking-widest uppercase">
                Clearing session...
            </p>
        </div>
    );
}
