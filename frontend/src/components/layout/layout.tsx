
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/layout/app-sidebar";

export function Layout() {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar will go here */}
            <AppSidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}
