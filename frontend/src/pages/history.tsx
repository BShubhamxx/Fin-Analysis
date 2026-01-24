
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, AlertCircle } from "lucide-react";

import { useNavigate } from "react-router-dom";

interface HistoryItem {
    id: string;
    filename: string;
    timestamp: string;
    row_count: number;
    status: string;
    analysis_report?: {
        benford_analysis?: {
            verdict: string;
            mad_score: number;
        };
        spending_summary?: {
            total_volume: number;
            transaction_count: number;
        }
    };
}

export default function HistoryPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // ... (existing fetch logic remains same)
        const fetchHistory = async () => {
            if (!user) return;
            try {
                const token = await user.getIdToken();
                const response = await fetch("http://localhost:8000/api/history/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch history");
                }

                const data = await response.json();
                setHistory(data);
            } catch (err) {
                console.error(err);
                setError("Could not load history. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    // ... (loading/error states remain same)
    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-2 text-destructive">
                <AlertCircle className="h-8 w-8" />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
                <p className="text-muted-foreground">
                    View your past uploads and fraud detection reports. Click on a row to view full analysis.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Uploads</CardTitle>
                </CardHeader>
                <CardContent>
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <FileText className="mb-4 h-12 w-12 opacity-20" />
                            <p>No analysis history found.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Filename</TableHead>
                                    <TableHead>Rows</TableHead>
                                    <TableHead>Total Volume</TableHead>
                                    <TableHead>Fraud Check</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => navigate(`/dashboard?id=${item.id}`)}
                                    >
                                        <TableCell className="font-medium">
                                            {new Date(item.timestamp).toLocaleDateString()} <span className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleTimeString()}</span>
                                        </TableCell>
                                        <TableCell>{item.filename}</TableCell>
                                        <TableCell>{item.row_count}</TableCell>
                                        <TableCell>
                                            {item.analysis_report?.spending_summary?.total_volume
                                                ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.analysis_report.spending_summary.total_volume)
                                                : "-"
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {item.analysis_report?.benford_analysis ? (
                                                <Badge
                                                    variant={
                                                        item.analysis_report.benford_analysis.verdict === "Pass"
                                                            ? "default" // shadcn default is black, maybe outline or custom class better?
                                                            : item.analysis_report.benford_analysis.verdict === "Fail"
                                                                ? "destructive"
                                                                : "secondary"
                                                    }
                                                    className={
                                                        item.analysis_report.benford_analysis.verdict === "Pass" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                                                            item.analysis_report.benford_analysis.verdict === "Fail" ? "bg-red-100 text-red-700 hover:bg-red-100" :
                                                                "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                                    }
                                                >
                                                    {item.analysis_report.benford_analysis.verdict.toUpperCase()}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">-</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
