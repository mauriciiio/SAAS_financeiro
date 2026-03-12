"use client";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

type ExpenseCategoryItem = {
    name: string;
    value: number;
};

type ExpensesByCategoryChartProps = {
    data: ExpenseCategoryItem[];
};

const COLORS = [
    "#22c55e",
    "#ef4444",
    "#3b82f6",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
];

export function ExpensesByCategoryChart({
    data,
}: ExpensesByCategoryChartProps) {
    return (
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">
                    Despesas por categoria
                </CardTitle>
                <p className="text-sm text-slate-500">
                    Distribuição dos seus gastos no mês atual.
                </p>
            </CardHeader>

            <CardContent className="p-6 pt-0">
                {data.length === 0 ? (
                    <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-500">
                        Nenhuma despesa cadastrada neste mês.
                    </div>
                ) : (
                    <>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={60}
                                        outerRadius={95}
                                        paddingAngle={3}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={entry.name}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) =>
                                            formatCurrency(Number(value))
                                        }
                                        contentStyle={{
                                            borderRadius: 16,
                                            border: "1px solid #e2e8f0",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-4 space-y-2">
                            {data.map((item, index) => (
                                <div
                                    key={item.name}
                                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="h-3 w-3 rounded-full"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <span className="text-sm text-slate-700">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-900">
                                        {formatCurrency(item.value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}