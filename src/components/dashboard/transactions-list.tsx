import { DeleteTransactionForm } from "@/components/forms/delete-transaction-form";
import { EditTransactionDialog } from "@/components/forms/edit-transaction-dialog";
import { formatCurrency } from "@/lib/format";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

type FilterParams = { type: string; category: string; month: string; year: string };

type TransactionsListProps = {
    transactions: TransactionItem[];
    categories: CategoryOption[];
    currentPage: number;
    totalPages: number;
    filterParams: FilterParams;
};

function buildPageUrl(page: number, filterParams: FilterParams) {
    const params = new URLSearchParams();
    if (filterParams.type) params.set("type", filterParams.type);
    if (filterParams.category) params.set("category", filterParams.category);
    if (filterParams.month) params.set("month", filterParams.month);
    if (filterParams.year) params.set("year", filterParams.year);
    params.set("page", String(page));
    return `/lancamentos?${params.toString()}`;
}

export function TransactionsList({
    transactions,
    categories,
    currentPage,
    totalPages,
    filterParams,
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

            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Página {currentPage} de {totalPages}
                    </p>

                    <div className="flex items-center gap-1">
                        {currentPage > 1 ? (
                            <a
                                href={buildPageUrl(currentPage - 1, filterParams)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                            >
                                <ChevronLeft size={16} />
                            </a>
                        ) : (
                            <span className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-xl border border-slate-100 text-slate-300 dark:border-slate-700 dark:text-slate-600">
                                <ChevronLeft size={16} />
                            </span>
                        )}

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                            .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((p, idx) =>
                                p === "..." ? (
                                    <span key={`ellipsis-${idx}`} className="px-1 text-sm text-slate-400">…</span>
                                ) : (
                                    <a
                                        key={p}
                                        href={buildPageUrl(p as number, filterParams)}
                                        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition ${
                                            p === currentPage
                                                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                                        }`}
                                    >
                                        {p}
                                    </a>
                                )
                            )}

                        {currentPage < totalPages ? (
                            <a
                                href={buildPageUrl(currentPage + 1, filterParams)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                            >
                                <ChevronRight size={16} />
                            </a>
                        ) : (
                            <span className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-xl border border-slate-100 text-slate-300 dark:border-slate-700 dark:text-slate-600">
                                <ChevronRight size={16} />
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
