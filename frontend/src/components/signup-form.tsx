"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import LoginWithGoogle from "@/components/LoginWithGoogle/LoginWithGoogle";

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            const result = await authService.register({
                username,
                email,
                password,
            });

            if (result.status === "success") {
                setSuccessMessage(
                    "Verification email sent. Please check your inbox to activate your account."
                );
            } else {
                setError(result.message || "Registration failed.");
            }
        } catch (err: any) {
            setError(
                err.message || "An unexpected error occurred. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (successMessage) {
        return (
            <div className={cn("flex flex-col gap-6 items-center text-center animate-in fade-in slide-in-from-top-1 duration-200", className)}>
                <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="size-6" />
                </div>
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold">Check your email</h2>
                    <p className="text-sm text-balance text-muted-foreground">
                        {successMessage}
                    </p>
                </div>
                <Link
                    href="/login"
                    className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                >
                    Back to Sign In
                </Link>
            </div>
        );
    }

    return (
        <form
            className={cn("flex flex-col gap-6", className)}
            onSubmit={handleSubmit}
            {...props}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Fill in the form below to create your account
                    </p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-1 duration-200">
                        <AlertCircle className="size-4 shrink-0" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                <Field>
                    <FieldLabel htmlFor="username">Full Name</FieldLabel>
                    <Input
                        id="username"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                        className="bg-background"
                    />
                </Field>
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
                        className="bg-background"
                    />
                    <FieldDescription>
                        We&apos;ll use this to contact you. We will not share your email
                        with anyone else.
                    </FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="bg-background"
                    />
                    <FieldDescription>
                        Must be at least 8 characters long.
                    </FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                    <Input
                        id="confirm-password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        className="bg-background"
                    />
                    <FieldDescription>Please confirm your password.</FieldDescription>
                </Field>
                <Field>
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                </Field>
                <FieldSeparator>Or continue with</FieldSeparator>
                <LoginWithGoogle isLoading={isLoading} hideLink />
                <Field>
                    <FieldDescription className="px-6 text-center">
                        Already have an account?{" "}
                        <Link href="/login" className="underline underline-offset-4">
                            Sign in
                        </Link>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    );
}

