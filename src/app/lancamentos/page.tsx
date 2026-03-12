import { TransactionForm } from "@/components/forms/transaction-form";
import { TransactionsFilters } from "@/components/dashboard/transactions-filters";
import { TransactionsList } from "@/components/dashboard/transactions-list";
import { TransactionsSummary } from "@/components/dashboard/transactions-summary";
import { RecurringTransactionsBanner } from "@/components/forms/recurring-transactions-banner";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { getTransactionsPageData } from "@/lib/transactions";
import { getPendingRecurringCount } from "./actions/apply-recurring-transactions";

type LancamentosPageProps = {
    searchParams?: Promise<{
        type?: string;
        category?: string;
        month?: string;
        year?: string;
    }>;
};

export default async function LancamentosPage({
    searchParams,
}: LancamentosPageProps) {
    const params = searchParams ? await searchParams : undefined;

    const [data, pendingCount] = await Promise.all([
        getTransactionsPageData({
            type: params?.type,
            category: params?.category,
            month: params?.month,
            year: params?.year,
        }),
        getPendingRecurringCount(),
    ]);

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
            <div className="flex min-h-screen">
                <Sidebar />

                <div className="flex min-w-0 flex-1 flex-col">
                    <Header userName={data.user.name} />

                    <main className="flex-1 p-6 lg:p-8">
                        <div className="mx-auto max-w-[1600px] space-y-6">
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                    Lançamentos
                                </h1>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Cadastre e acompanhe suas receitas e despesas.
                                </p>
                            </div>

                            {pendingCount > 0 && (
                                <RecurringTransactionsBanner pendingCount={pendingCount} />
                            )}

                            <TransactionsSummary
                                totalIncome={data.summary.totalIncome}
                                totalExpense={data.summary.totalExpense}
                                balance={data.summary.balance}
                            />

                            <TransactionsFilters
                                categories={data.allCategories.map((item) => ({
                                    id: item.id,
                                    name: item.name,
                                }))}
                                selectedType={data.filters.type}
                                selectedCategory={data.filters.category}
                                selectedMonth={data.filters.month}
                                selectedYear={data.filters.year}
                            />

                            <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
                                <div>
                                    <TransactionForm
                                        incomeCategories={data.incomeCategories}
                                        expenseCategories={data.expenseCategories}
                                    />
                                </div>

                                <div>
                                    <TransactionsList
                                        categories={data.allCategories.map((item) => ({
                                            id: item.id,
                                            name: item.name,
                                            type: item.type,
                                        }))}
                                        transactions={data.transactions.map((item) => ({
                                            id: item.id,
                                            title: item.title,
                                            description: item.description,
                                            amount: Number(item.amount),
                                            date: item.date,
                                            type: item.type,
                                            isFixed: item.isFixed,
                                            categoryId: item.categoryId,
                                            category: {
                                                name: item.category.name,
                                            },
                                        }))}
                                    />
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
