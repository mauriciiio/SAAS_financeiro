"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

type MonthlyChartItem = {
    month: string;
    receitas: number;
    despesas: number;
    investimentos: number;
};

type MonthlyChartProps = {
    data: MonthlyChartItem[];
};

export function MonthlyChart({ data }: MonthlyChartProps) {
    return (
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
                <div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Evolução mensal
                    </CardTitle>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Receitas, despesas e investimentos dos últimos 6 meses.
                    </p>
                </div>

                <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                    Dados reais
                </div>
            </CardHeader>

            <CardContent className="h-[360px] p-6 pt-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis
                            tickFormatter={(value) =>
                                new Intl.NumberFormat("pt-BR", {
                                    notation: "compact",
                                    maximumFractionDigits: 1,
                                }).format(value)
                            }
                        />
                        <Tooltip
                            formatter={(value: number) => formatCurrency(Number(value))}
                            contentStyle={{
                                borderRadius: 16,
                                border: "1px solid #e2e8f0",
                            }}
                        />
                        <Bar dataKey="receitas" radius={[8, 8, 0, 0]} fill="#22c55e" />
                        <Bar dataKey="despesas" radius={[8, 8, 0, 0]} fill="#ef4444" />
                        <Bar dataKey="investimentos" radius={[8, 8, 0, 0]} fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}