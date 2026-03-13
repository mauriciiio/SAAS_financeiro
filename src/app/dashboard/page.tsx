import { ExpensesByCategoryChart } from "@/components/dashboard/expenses-by-category-chart";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { QuickTransactionDialog } from "@/components/forms/quick-transaction-dialog";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { getDashboardData } from "@/lib/dashboard";

export default async function DashboardPage() {
    const data = await getDashboardData();

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
            <div className="flex min-h-screen">
                <Sidebar />

                <div className="flex min-w-0 flex-1 flex-col">
                    <Header userName={data.user.name} />

                    <main className="flex-1 p-6 lg:p-8">
                        <div className="mx-auto max-w-[1600px] space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                        Finance App
                                    </h1>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Controle financeiro pessoal
                                    </p>
                                </div>
                                <QuickTransactionDialog
                                    incomeCategories={data.incomeCategories}
                                    expenseCategories={data.expenseCategories}
                                />
                            </div>

                            <SummaryCards
                                totalIncome={data.summary.totalIncome}
                                totalExpense={data.summary.totalExpense}
                                totalInvestments={data.summary.totalInvestments}
                                balance={data.summary.balance}
                            />

                            <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.7fr)_420px]">
                                <div className="min-w-0">
                                    <MonthlyChart data={data.monthlyEvolution} />
                                </div>

                                <div>
                                    <RecentTransactions transactions={data.recentTransactions} />
                                </div>
                            </section>

                            <section className="grid gap-6 2xl:grid-cols-[420px_minmax(0,1fr)]">
                                <div>
                                    <ExpensesByCategoryChart data={data.expensesByCategory} />
                                </div>

                                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                        Visão do mês
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Resumo consolidado do seu momento financeiro atual.
                                    </p>

                                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/50">
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Receitas</p>
                                            <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                                                {new Intl.NumberFormat("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                }).format(data.summary.totalIncome)}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/50">
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Despesas</p>
                                            <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                                                {new Intl.NumberFormat("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                }).format(data.summary.totalExpense)}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/50">
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Investimentos</p>
                                            <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                                                {new Intl.NumberFormat("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                }).format(data.summary.totalInvestments)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/50">
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Total investido (histórico)</p>
                                            <p className="mt-2 text-xl font-semibold text-blue-600 dark:text-blue-400">
                                                {new Intl.NumberFormat("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                }).format(data.summary.totalInvestedAllTime)}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/50">
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Taxa de poupança</p>
                                            <p className={`mt-2 text-xl font-semibold ${data.summary.savingsRate >= 20 ? "text-emerald-600 dark:text-emerald-400" : data.summary.savingsRate >= 0 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>
                                                {data.summary.savingsRate}% da renda
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded-2xl bg-slate-900 p-5 text-white">
                                        <p className="text-sm text-slate-300">Saldo atual do mês</p>
                                        <p className="mt-2 text-3xl font-semibold">
                                            {new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(data.summary.balance)}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}