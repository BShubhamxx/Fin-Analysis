
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, AlertCircle } from "lucide-react";

interface AIInsightsData {
    summary: string;
    key_findings: string[];
    recommendations: string[];
}

interface AnalysisInsightsProps {
    summary: any;
    aiInsights?: AIInsightsData;
}

export function AnalysisInsights({ summary, aiInsights }: AnalysisInsightsProps) {
    if (!summary) return null;

    // Helper to find highest spending month
    const getHighestMonth = () => {
        const trend = summary.monthly_trend;
        if (!trend || Object.keys(trend).length === 0) return null;

        // Sort keys by value descending
        const sortedMonths = Object.entries(trend).sort(([, a]: any, [, b]: any) => b - a);
        const [month, amount] = sortedMonths[0];
        // Format month YYYY-MM to readable
        const date = new Date(month + "-01"); // Append day to make parsing safe
        return {
            monthName: date.toLocaleDateString('default', { month: 'long', year: 'numeric' }),
            amount: Number(amount)
        };
    };

    // Helper to find top category
    const getTopCategory = () => {
        const cats = summary.top_categories;
        if (!cats || Object.keys(cats).length === 0) return null;

        // cats is { "CatName": { sum: X, count: Y }, ... }
        // We need to sort by sum (abs value usually, but let's assume sum is what matters)
        const entries = Object.entries(cats);
        // Sort by ABS sum
        entries.sort((a: any, b: any) => Math.abs(b[1].sum) - Math.abs(a[1].sum));

        const [name, stats]: [string, any] = entries[0] as [string, any];
        return { name, amount: stats.sum };
    };

    const topMonth = getHighestMonth();
    const topCategory = getTopCategory();
    const avgTransaction = summary.avg_transaction || 0;

    // AI MODE
    if (aiInsights && aiInsights.summary && !aiInsights.summary.includes("unavailable")) {
        return (
            <Card className="bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <Lightbulb className="size-5 text-purple-600" />
                        <CardTitle className="text-lg text-purple-700 dark:text-purple-300">AI Analysis & Insights</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-foreground/80 leading-relaxed italic">
                        "{aiInsights.summary}"
                    </p>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="bg-background/60 p-4 rounded-lg border">
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <AlertCircle className="size-4 text-amber-500" /> Key Findings
                            </h4>
                            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                                {aiInsights.key_findings.map((finding, i) => (
                                    <li key={i}>{finding}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background/60 p-4 rounded-lg border">
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <TrendingUp className="size-4 text-green-500" /> Recommendations
                            </h4>
                            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                                {aiInsights.recommendations.map((rec, i) => (
                                    <li key={i}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // FALLBACK (Rule-Based)
    return (
        <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <Lightbulb className="size-5 text-blue-500" />
                    <CardTitle className="text-lg text-blue-700 dark:text-blue-300">Analysis Insights</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Insight 1: Peak Spending */}
                    {topMonth && (
                        <div className="flex gap-3 items-start p-3 bg-background/60 rounded-lg border">
                            <TrendingUp className="size-5 text-muted-foreground mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-sm">Peak Activity</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Your highest spending activity was in <span className="font-medium text-foreground">{topMonth.monthName}</span>,
                                    totaling <span className="font-medium text-foreground">${topMonth.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Insight 2: Top Category */}
                    {topCategory && (
                        <div className="flex gap-3 items-start p-3 bg-background/60 rounded-lg border">
                            <AlertCircle className="size-5 text-muted-foreground mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-sm">Primary Expense</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    <span className="font-medium text-foreground">{topCategory.name}</span> is your largest category,
                                    accounting for <span className="font-medium text-foreground">${topCategory.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> of volume.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Insight 3: Transaction Avg */}
                    <div className="flex gap-3 items-start p-3 bg-background/60 rounded-lg border">
                        <TrendingUp className="size-5 text-muted-foreground mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-sm">Average Transaction</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                                On average, each transaction is about <span className="font-medium text-foreground">${Math.abs(avgTransaction).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
