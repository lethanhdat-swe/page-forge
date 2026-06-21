"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/AuthStore";
import { authService } from "@/services/auth";

interface SessionProviderProps {
    children: React.ReactNode;
}

export default function SessionProvider({ children }: SessionProviderProps) {
    const { setAuth, clearAuth } = useAuthStore();

    // 1. EXECUTE SYNCHRONOUSLY BEFORE RENDER
    // Check tokens and store state instantly to determine initialization value
    const hasAccessToken =
        typeof window !== "undefined" && !!Cookies.get("access_token");
    const hasRefreshToken =
        typeof window !== "undefined" && !!Cookies.get("refresh_token");
    const isStorePopulated = useAuthStore.getState().isAuthenticated;

    // 2. INITIALIZE HYDRATION STATE DYNAMICALLY
    // Start as true on both server and client to prevent hydration mismatch.
    // We will drop to false in useEffect if a refresh token exists but no access token is present.
    const [isHydrated, setIsHydrated] = useState(true);

    useEffect(() => {
        const currentRefreshToken = Cookies.get("refresh_token");
        const currentAccessToken = Cookies.get("access_token");
        const isStorePopulated = useAuthStore.getState().isAuthenticated;

        // If we have a refresh token but no active access token/store state,
        // we show the loader while we perform silent refresh
        if (currentRefreshToken && (!currentAccessToken || !isStorePopulated)) {
            setIsHydrated(false);
        }

        // Fast track exit for guests inside useEffect to clean states safely
        if (!currentRefreshToken) {
            clearAuth();
            setIsHydrated(true);
            return;
        }

        const handleSilentRefresh = async () => {
            const tokenForRefresh = Cookies.get("refresh_token");
            if (!tokenForRefresh) {
                clearAuth();
                window.location.href = "/logout?reason=expired";
                return;
            }

            try {
                const result = await authService.refreshToken({
                    refreshToken: tokenForRefresh,
                });

                console.log(result);

                if (result.status === "success" && result.data.accessToken) {
                    const {
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                        user,
                    } = result.data;

                    Cookies.set("refresh_token", newRefreshToken, {
                        expires: 7,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        path: "/",
                    });
                    Cookies.set("access_token", newAccessToken, {
                        expires: 15 / 1440,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        path: "/",
                    });

                    setAuth(user, newAccessToken, newRefreshToken);
                } else {
                    clearAuth();
                    window.location.href = "/logout?reason=expired";
                }
            } catch (error) {
                console.error("Auto refresh background loop failed:", error);
            } finally {
                setIsHydrated(true);
            }
        };

        handleSilentRefresh();

        const REFRESH_INTERVAL_MS = 10 * 60 * 1000;
        const intervalId = setInterval(
            handleSilentRefresh,
            REFRESH_INTERVAL_MS,
        );

        return () => clearInterval(intervalId);
    }, [setAuth, clearAuth]);

    if (!isHydrated) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
                <p className="text-sm font-mono tracking-widest uppercase animate-pulse">
                    Validating session...
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
