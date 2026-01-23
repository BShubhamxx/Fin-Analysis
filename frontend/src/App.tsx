
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/layout";

import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import LandingPage from "@/pages/landing";
import { ProtectedRoute } from "@/components/protected-route";

// Placeholder pages (will be implemented in later phases)
const Dashboard = () => <div className="p-4"><h1 className="text-2xl font-bold">Dashboard</h1><p>Welcome to Fin-Analysis</p></div>;
const UploadPage = () => <div className="p-4"><h1 className="text-2xl font-bold">Upload File</h1><p>Upload your financial data here</p></div>;
const HistoryPage = () => <div className="p-4"><h1 className="text-2xl font-bold">Analysis History</h1><p>View past analyses</p></div>;

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/upload" element={<UploadPage />} />
                        <Route path="/history" element={<HistoryPage />} />
                    </Route>
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
