
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

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
import { AuthService, LoginFormData, loginSchema } from "@/lib/auth-service";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: LoginFormData) {
        setIsLoading(true);
        try {
            await AuthService.login(data);
            navigate("/dashboard");
        } catch (error: any) {
            console.error(error);
            form.setError("root", {
                message: error.message || "Failed to login. Please check your credentials."
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
                    <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email to sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter your password"
                                                    className="bg-background/50 pr-10"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="size-4" />
                                                    ) : (
                                                        <Eye className="size-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="mr-2 size-4" />
                                        Sign In
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground">
                    <p>
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primary hover:underline font-medium transition-colors">
                            Sign up
                        </Link>
                    </p>
                    <Link to="/forgot-password" className="hover:text-foreground transition-colors">
                        Forgot your password?
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
