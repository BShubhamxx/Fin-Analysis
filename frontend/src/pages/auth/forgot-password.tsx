
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthService } from "@/lib/auth-service";

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(data: ForgotPasswordFormValues) {
        setIsLoading(true);
        try {
            await AuthService.resetPassword(data.email);
            setIsSubmitted(true);
        } catch (error: any) {
            console.error(error);
            form.setError("root", {
                message: error.message || "Failed to send reset email. Please try again."
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 animate-fade-in">
            <Card className="w-full max-w-md glass-card border-none">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <code className="text-primary text-xl font-bold">FA</code>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Reset password</CardTitle>
                    <CardDescription className="text-center">
                        {isSubmitted
                            ? "Check your email for a reset link"
                            : "Enter your email to receive a reset link"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSubmitted ? (
                        <div className="text-center space-y-4">
                            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-lg text-sm">
                                If an account exists for <strong>{form.getValues("email")}</strong>, you will receive password reset instructions shortly.
                            </div>
                            <Button variant="outline" className="w-full" asChild>
                                <Link to="/login">Return to login</Link>
                            </Button>
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                {form.formState.errors.root && (
                                    <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                                        {form.formState.errors.root.message}
                                    </div>
                                )}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="name@example.com" {...field} className="bg-background/50" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 size-4 animate-spin" />
                                            Sending link...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="mr-2 size-4" />
                                            Send Reset Link
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
                {!isSubmitted && (
                    <CardFooter className="flex justify-center text-sm text-muted-foreground">
                        <Link to="/login" className="hover:text-foreground transition-colors flex items-center gap-2">
                            ← Back to login
                        </Link>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
