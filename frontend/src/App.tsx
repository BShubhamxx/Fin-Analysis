
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/layout";

// Placeholder pages (will be implemented in later phases)
const Dashboard = () => <div className="p-4"><h1 className="text-2xl font-bold">Dashboard</h1><p>Welcome to Fin-Analysis</p></div>;
const UploadPage = () => <div className="p-4"><h1 className="text-2xl font-bold">Upload File</h1><p>Upload your financial data here</p></div>;
const HistoryPage = () => <div className="p-4"><h1 className="text-2xl font-bold">Analysis History</h1><p>View past analyses</p></div>;
const Login = () => <div className="flex h-screen items-center justify-center"><h1>Login Page (Coming soon)</h1></div>;

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="upload" element={<UploadPage />} />
                    <Route path="history" element={<HistoryPage />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
