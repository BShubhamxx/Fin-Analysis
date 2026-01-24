
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { BenfordChart } from "@/components/dashboard/benford-chart";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Download } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";

export default function Dashboard() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [latestAnalysis, setLatestAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (!user) return;
            try {
                const token = await user.getIdToken();
                const analysisId = searchParams.get("id");

                let url = "http://localhost:8000/api/history/";

                // If ID is provided, fetch specific item. 
                // Note: backend endpoint for specific item is /api/history/{id}
                if (analysisId) {
                    url = `http://localhost:8000/api/history/${analysisId}`;
                }

                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    if (analysisId) {
                        // Single object returned
                        setLatestAnalysis(data);
                    } else {
                        // List returned, take first
                        if (data && data.length > 0) {
                            setLatestAnalysis(data[0]);
                        }
                    }
                } else {
                    console.error("Failed to fetch data", response.status);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [user, searchParams]);

    const handleExport = async () => {
        if (!latestAnalysis || !user) return;

        try {
            const token = await user.getIdToken();
            const response = await fetch(`http://localhost:8000/api/export/${latestAnalysis.id}/pdf`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Export failed");

            // Trigger download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Analysis_${latestAnalysis.filename}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Export error:", error);
            // Ideally show a toast notification here
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!latestAnalysis) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user?.displayName || user?.email}</p>
                </div>
                <Card className="bg-muted/30 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <h3 className="text-lg font-semibold mb-2">No Analysis Data Yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            Upload your first financial dataset to see insights, fraud detection scores, and spending trends here.
                        </p>
                        <Button asChild>
                            <Link to="/upload">
                                Upload Data <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { analysis_report, filename, timestamp } = latestAnalysis;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Latest analysis from <span className="font-medium text-foreground">{filename}</span> ({new Date(timestamp).toLocaleDateString()})
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                    <Button variant="outline" asChild>
                        <Link to="/history">View History</Link>
                    </Button>
                    <Button asChild>
                        <Link to="/upload">New Analysis</Link>
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Spending Summary */}
                {analysis_report?.spending_summary && (
                    <SummaryCards summary={analysis_report.spending_summary} />
                )}

                {analysis_report?.spending_summary && (
                    <SummaryCards summary={analysis_report.spending_summary} />
                )}

                {/* Monthly Trend Chart */}
                {analysis_report?.spending_summary?.monthly_trend && (
                    <div className="w-full">
                        <TrendChart data={analysis_report.spending_summary.monthly_trend} />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Benford Chart (2 cols) */}
                    <div className="md:col-span-2">
                        {analysis_report?.benford_analysis && (
                            <BenfordChart distribution={analysis_report.benford_analysis.distribution} />
                        )}
                    </div>

                    {/* Quick Stats / Verdict (1 col) */}
                    <div className="space-y-6">
                        {analysis_report?.benford_analysis && (
                            <Card className={`${analysis_report.benford_analysis.verdict === 'Pass' ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' :
                                analysis_report.benford_analysis.verdict === 'Fail' ? 'border-red-200 bg-red-50/50 dark:bg-red-900/10' :
                                    'border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/10'
                                }`}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">Fraud Detection</CardTitle>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${analysis_report.benford_analysis.verdict === 'Pass' ? 'bg-green-100 text-green-700' :
                                            analysis_report.benford_analysis.verdict === 'Fail' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {analysis_report.benford_analysis.verdict.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Benford's Law Score</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold tracking-tighter">
                                        {analysis_report.benford_analysis.mad_score}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Lower is better. &lt; 0.02 is ideal.
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Processing Info</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Rows</span>
                                    <span className="font-medium">{latestAnalysis.row_count}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="font-medium capitalize">{latestAnalysis.status}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">ID</span>
                                    <span className="font-mono text-xs text-muted-foreground truncate max-w-[100px]" title={latestAnalysis.id}>
                                        {latestAnalysis.id}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
