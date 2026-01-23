
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";

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
import { AuthService, SignupFormData, signupSchema } from "@/lib/auth-service";

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(data: SignupFormData) {
        setIsLoading(true);
        try {
            await AuthService.signup(data);
            navigate("/dashboard");
        } catch (error: any) {
            console.error(error);
            form.setError("root", {
                message: error.message || "Failed to create account. Please try again."
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
                    <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email below to create your account
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
                                            <Input type="password" placeholder="Create a password" {...field} className="bg-background/50" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Confirm your password" {...field} className="bg-background/50" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 size-4" />
                                        Sign Up
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary hover:underline font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
