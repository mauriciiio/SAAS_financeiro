import { Tags, ArrowUpRight, ArrowDownRight, PiggyBank } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type CategoriesSummaryProps = {
    total: number;
    income: number;
    expense: number;
    investment: number;
};

export function CategoriesSummary({
    total,
    income,
    expense,
    investment,
}: CategoriesSummaryProps) {
    const items = [
        {
            title: "Total",
            value: total,
            helper: "Categorias cadastradas",
            icon: Tags,
            iconBg: "bg-slate-100",
            iconColor: "text-slate-700",
        },
        {
            title: "Receitas",
            value: income,
            helper: "Categorias de entrada",
            icon: ArrowUpRight,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
        },
        {
            title: "Despesas",
            value: expense,
            helper: "Categorias de saída",
            icon: ArrowDownRight,
            iconBg: "bg-rose-100",
            iconColor: "text-rose-600",
        },
        {
            title: "Investimentos",
            value: investment,
            helper: "Categorias de aporte",
            icon: PiggyBank,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
    ] as const;

    return (
        <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <Card
                        key={item.title}
                        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                    >
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{item.title}</p>
                                    <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                                        {item.value}
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