import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

type TransactionsSummaryProps = {
    totalIncome: number;
    totalExpense: number;
    balance: number;
};

export function TransactionsSummary({
    totalIncome,
    totalExpense,
    balance,
}: TransactionsSummaryProps) {
    const items = [
        {
            title: "Receitas",
            value: totalIncome,
            helper: "Total cadastrado",
            icon: ArrowUpRight,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
        },
        {
            title: "Despesas",
            value: totalExpense,
            helper: "Total cadastrado",
            icon: ArrowDownRight,
            iconBg: "bg-rose-100",
            iconColor: "text-rose-600",
        },
        {
            title: "Saldo",
            value: balance,
            helper: "Receitas - despesas",
            icon: Wallet,
            iconBg: "bg-violet-100",
            iconColor: "text-violet-600",
        },
    ] as const;

    return (
        <section className="grid gap-5 md:grid-cols-3">
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <Card
                        key={item.title}
                        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
                    >
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.title}</p>
                                    <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                        {formatCurrency(item.value)}
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-500">{item.helper}</p>
                                </div>

                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconBg} ${item.iconColor}`}
                                >
                                    <Icon size={22} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </section>
    );
}