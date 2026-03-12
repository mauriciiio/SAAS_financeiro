import { PiggyBank, WalletCards } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

type InvestmentsSummaryProps = {
    totalInvested: number;
    totalCount: number;
};

export function InvestmentsSummary({
    totalInvested,
    totalCount,
}: InvestmentsSummaryProps) {
    const items = [
        {
            title: "Total investido",
            value: formatCurrency(totalInvested),
            helper: "Soma de todos os aportes",
            icon: PiggyBank,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            title: "Quantidade de aportes",
            value: String(totalCount),
            helper: "Total de registros cadastrados",
            icon: WalletCards,
            iconBg: "bg-violet-100",
            iconColor: "text-violet-600",
        },
    ] as const;

    return (
        <section className="grid gap-5 md:grid-cols-2">
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