"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription } from "@/components/ui/field";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/AuthStore";
import { AlertCircle, Loader2 } from "lucide-react";

export default function LoginWithGoogle({
    isLoading: parentIsLoading,
    hideLink = false,
}: {
    isLoading: boolean;
    hideLink?: boolean;
}) {
    const router = useRouter();
    const [localIsLoading, setLocalIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isLoading = parentIsLoading || localIsLoading;

    const handleGoogleLogin = async () => {
        setLocalIsLoading(true);
        setError(null);
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const idToken = await userCredential.user.getIdToken();

            const result = await authService.loginWithGoogle({ idToken });
            if (result.status === "success" && result.data) {
                useAuthStore
                    .getState()
                    .setAuth(
                        result.data.user,
                        result.data.accessToken,
                        result.data.refreshToken,
                    );
                router.push("/dashboard");
            } else {
                setError(result.message || "Google authentication failed.");
            }
        } catch (err: any) {
            if (err.code === "auth/popup-closed-by-user") {
                setError("Login popup closed. Please try again.");
            } else {
                setError(
                    err.message ||
                        "An unexpected error occurred during Google sign-in.",
                );
            }
        } finally {
            setLocalIsLoading(false);
        }
    };

    return (
        <Field>
            {error && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 mb-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="size-4 shrink-0" />
                    <p className="font-medium">{error}</p>
                </div>
            )}
            <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={handleGoogleLogin}
                className="w-full gap-2"
            >
                {isLoading ? (
                    <Loader2 className="size-4 animate-spin shrink-0" />
                ) : (
                    <svg
                        className="size-4 shrink-0"
                        aria-hidden="true"
                        focusable="false"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488 512"
                    >
                        <path
                            fill="currentColor"
                            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                        />
                    </svg>
                )}
                {isLoading ? "Signing in..." : "Login with Google"}
            </Button>
            {!hideLink && (
                <FieldDescription className="text-center mt-2">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="underline underline-offset-4 font-medium text-foreground"
                    >
                        Sign up
                    </Link>
                </FieldDescription>
            )}
        </Field>
    );
}

