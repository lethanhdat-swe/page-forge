"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/AuthStore";
import { AlertCircle, Loader2 } from "lucide-react";
import LoginWithGoogle from "@/components/LoginWithGoogle/LoginWithGoogle";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await authService.login({ email, password });
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
                setError(result.message || "Invalid credentials.");
            }
        } catch (err: any) {
            setError(
                err.message ||
                    "An unexpected error occurred. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            className={cn("flex flex-col gap-6", className)}
            onSubmit={handleSubmit}
            {...props}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">
                        Login to your account
                    </h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-1 duration-200">
                        <AlertCircle className="size-4 shrink-0" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                </Field>
                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <a
                            href="#"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </a>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                </Field>
                <Field>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading && (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        )}
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                </Field>
                <FieldSeparator>Or continue with</FieldSeparator>
                <LoginWithGoogle isLoading={isLoading} />
            </FieldGroup>
        </form>
    );
}
