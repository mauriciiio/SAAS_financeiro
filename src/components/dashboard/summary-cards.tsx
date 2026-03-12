import { ArrowDownRight, ArrowUpRight, PiggyBank, Wallet2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

type SummaryCardsProps = {
    totalIncome: number;
    totalExpense: number;
    totalInvestments: number;
    balance: number;
};

const cardConfig = [
    {
        key: "totalIncome",
        title: "Receitas",
        icon: ArrowUpRight,
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        helper: "Entradas no mês atual",
    },
    {
        key: "totalExpense",
        title: "Despesas",
        icon: ArrowDownRight,
        iconBg: "bg-rose-100",
        iconColor: "text-rose-600",
        helper: "Saídas no mês atual",
    },
    {
        key: "totalInvestments",
        title: "Investimentos",
        icon: PiggyBank,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        helper: "Aportes realizados",
    },
    {
        key: "balance",
        title: "Saldo",
        icon: Wallet2,
        iconBg: "bg-violet-100",
        iconColor: "text-violet-600",
        helper: "Disponível após os lançamentos",
    },
] as const;

export function SummaryCards({
    totalIncome,
    totalExpense,
    totalInvestments,
    balance,
}: SummaryCardsProps) {
    const values = {
        totalIncome,
        totalExpense,
        totalInvestments,
        balance,
    };

    return (
        <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
            {cardConfig.map((card) => {
                const Icon = card.icon;

                return (
                    <Card
                        key={card.title}
                        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
                    >
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</p>
                                    <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                        {formatCurrency(values[card.key])}
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{card.helper}</p>
                                </div>

                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor}`}
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