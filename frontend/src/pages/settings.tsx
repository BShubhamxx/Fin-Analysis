
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { updateProfile } from "firebase/auth";
import { Loader2, User, CheckCircle2, AlertCircle } from "lucide-react";

export default function SettingsPage() {
    const { user } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await updateProfile(user, {
                displayName: displayName
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            console.error("Profile update error:", err);
            setError(err.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Account Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                        Update your account details and public profile information.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="bg-muted text-muted-foreground"
                            />
                            <p className="text-[0.8rem] text-muted-foreground">
                                Your email address matches your Firebase account and cannot be changed here.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                                id="displayName"
                                placeholder="Your Name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-destructive text-sm font-medium p-3 bg-destructive/10 rounded-md">
                                <AlertCircle className="size-4" />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="flex items-center gap-2 text-green-600 text-sm font-medium p-3 bg-green-500/10 rounded-md">
                                <CheckCircle2 className="size-4" />
                                Profile updated successfully!
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
