import { DeleteTransactionForm } from "@/components/forms/delete-transaction-form";
import { EditTransactionDialog } from "@/components/forms/edit-transaction-dialog";
import { formatCurrency } from "@/lib/format";

type CategoryOption = {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
};

type TransactionItem = {
    id: string;
    title: string;
    description: string | null;
    amount: number;
    date: Date;
    type: "INCOME" | "EXPENSE";
    isFixed: boolean;
    categoryId: string;
    category: {
        name: string;
    };
};

type TransactionsListProps = {
    transactions: TransactionItem[];
    categories: CategoryOption[];
};

export function TransactionsList({
    transactions,
    categories,
}: TransactionsListProps) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Lançamentos</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Lista das suas receitas e despesas cadastradas.
                </p>
            </div>

            <div className="space-y-3">
                {transactions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
                        Nenhum lançamento cadastrado ainda.
                    </div>
                ) : (
                    transactions.map((transaction) => {
                        const amountColor =
                            transaction.type === "INCOME" ? "text-emerald-600" : "text-rose-600";
                        const prefix = transaction.type === "INCOME" ? "+" : "-";

                        return (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-700/50"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                            {transaction.title}
                                        </p>
                                        {transaction.isFixed && (
                                            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] text-slate-600">
                                                Fixo
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        {transaction.category.name} •{" "}
                                        {new Intl.DateTimeFormat("pt-BR").format(transaction.date)}
                                    </p>

                                    {transaction.description && (
                                        <p className="mt-1 truncate text-xs text-slate-400 dark:text-slate-500">
                                            {transaction.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className={`text-sm font-semibold ${amountColor}`}>
                                        {prefix} {formatCurrency(transaction.amount)}
                                    </div>

                                    <EditTransactionDialog
                                        transaction={{
                                            id: transaction.id,
                                            title: transaction.title,
                                            description: transaction.description,
                                            amount: transaction.amount,
                                            date: transaction.date,
                                            type: transaction.type,
                                            isFixed: transaction.isFixed,
                                            categoryId: transaction.categoryId,
                                        }}
                                        categories={categories}
                                    />

                                    <DeleteTransactionForm id={transaction.id} />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}