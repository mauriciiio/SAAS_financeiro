import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

type RecentItem = {
    id: string;
    title: string;
    category: string;
    amount: number;
    type: "income" | "expense" | "investment";
};

type RecentTransactionsProps = {
    transactions: RecentItem[];
};

export function RecentTransactions({
    transactions,
}: RecentTransactionsProps) {
    return (
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">
                    Últimas movimentações
                </CardTitle>
                <p className="text-sm text-slate-500">
                    Suas movimentações financeiras mais recentes.
                </p>
            </CardHeader>

            <CardContent className="space-y-3 p-6 pt-0">
                {transactions.map((transaction) => {
                    const amountColor =
                        transaction.type === "income"
                            ? "text-emerald-600"
                            : transaction.type === "investment"
                                ? "text-blue-600"
                                : "text-rose-600";

                    const prefix = transaction.type === "income" ? "+" : "-";

                    return (
                        <div
                            key={transaction.id}
                            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 transition hover:bg-slate-100"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {transaction.title}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">{transaction.category}</p>
                            </div>

                            <div className={`text-sm font-semibold ${amountColor}`}>
                                {prefix} {formatCurrency(transaction.amount)}
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}