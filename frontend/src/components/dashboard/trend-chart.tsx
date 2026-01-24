
import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrendChartProps {
    data: Record<string, number>;
}

export function TrendChart({ data }: TrendChartProps) {
    const chartData = useMemo(() => {
        if (!data) return [];
        return Object.entries(data)
            .map(([month, amount]) => ({
                month,
                amount,
            }))
            .sort((a, b) => a.month.localeCompare(b.month));
    }, [data]);

    if (!data || Object.keys(data).length === 0) {
        return null;
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Monthly Spending Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                            <XAxis
                                dataKey="month"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                                formatter={(value: any) => [`$${Number(value).toFixed(2)}`, "Net Amount"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
