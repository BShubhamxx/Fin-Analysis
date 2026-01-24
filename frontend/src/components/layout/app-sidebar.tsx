
import { Upload, History, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { ModeToggle } from "@/components/mode-toggle";
import Logo from "@/assets/logo.svg";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Upload, label: "Upload", href: "/upload" },
    { icon: History, label: "History", href: "/history" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function AppSidebar() {
    const location = useLocation();
    const { signOut } = useAuth();

    return (
        <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm hidden md:flex flex-col">
            <div className="p-6 border-b border-border">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <img src={Logo} alt="Fin-Analysis Logo" className="h-8 w-auto" />
                    Fin-Analysis
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;

                    return (
                        <Link key={item.href} to={item.href}>
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3",
                                    isActive && "bg-secondary/50 font-medium"
                                )}
                            >
                                <Icon className="size-4" />
                                {item.label}
                            </Button>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border flex items-center justify-between gap-2">
                <Button
                    variant="ghost"
                    className="flex-1 justify-start gap-3 text-muted-foreground hover:text-destructive"
                    onClick={() => signOut()}
                >
                    <LogOut className="size-4" />
                    Sign Out
                </Button>
                <div className="shrink-0">
                    <ModeToggle />
                </div>
            </div>
        </aside>
    )
}
