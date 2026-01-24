
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BenfordChartProps {
    distribution: Record<string, { actual: number; expected: number }>;
}

export function BenfordChart({ distribution }: BenfordChartProps) {
    if (!distribution) return null;

    // Transform data for Recharts
    const data = Object.entries(distribution).map(([digit, values]) => ({
        digit,
        Actual: (values.actual * 100).toFixed(1), // Percent
        Expected: (values.expected * 100).toFixed(1), // Percent
    }));

    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle>Benford's Law Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="digit" />
                            <YAxis unit="%" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Expected" fill="#8884d8" name="Expected" />
                            <Bar dataKey="Actual" fill="#82ca9d" name="Actual" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
