"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/AuthStore";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setErrorMessage("Verification token is missing. Please request a new link.");
            return;
        }

        let isMounted = true;

        const verifyToken = async () => {
            try {
                const result = await authService.verify({ token });
                if (!isMounted) return;

                if (result.status === "success" && result.data) {
                    setStatus("success");
                    useAuthStore.getState().setAuth(
                        result.data.user,
                        result.data.accessToken,
                        result.data.refreshToken
                    );
                    router.push("/dashboard");
                } else {
                    setStatus("error");
                    setErrorMessage(result.message || "Failed to verify account.");
                }
            } catch (err: any) {
                if (!isMounted) return;
                setStatus("error");
                setErrorMessage(
                    err.message || "An unexpected error occurred during verification."
                );
            }
        };

        verifyToken();

        return () => {
            isMounted = false;
        };
    }, [token, router]);

    if (status === "loading") {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground animate-in fade-in duration-300">
                <p className="text-sm font-mono tracking-widest uppercase animate-pulse">
                    Validating verification token...
                </p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground animate-in fade-in duration-300">
                <div className="w-full max-w-md p-6 border border-destructive/20 rounded-lg bg-destructive/5 flex flex-col gap-4 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <AlertCircle className="size-6" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">Verification Failed</h2>
                    <p className="text-sm text-muted-foreground">{errorMessage}</p>
                    <div className="flex flex-col gap-2 mt-2">
                        <Link
                            href="/register"
                            className={cn(buttonVariants({ variant: "default" }), "w-full")}
                        >
                            Go to Sign Up
                        </Link>
                        <Link
                            href="/login"
                            className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground animate-in fade-in duration-300">
            <div className="w-full max-w-md p-6 border border-emerald-500/20 rounded-lg bg-emerald-500/5 flex flex-col gap-4 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-6 animate-bounce" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-emerald-800 dark:text-emerald-300">Verification Successful</h2>
                <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
                    <p className="text-sm font-mono tracking-widest uppercase animate-pulse">
                        Loading...
                    </p>
                </div>
            }
        >
            <VerifyContent />
        </Suspense>
    );
}
