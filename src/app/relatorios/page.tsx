import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { getReportsData, getAvailableYears } from "@/lib/reports";
import { formatCurrency } from "@/lib/format";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";
import { ExpensesByCategoryChart } from "@/components/dashboard/expenses-by-category-chart";
import { ReportsCsvButton } from "@/components/dashboard/reports-csv-button";
import {
    ArrowUpRight,
    ArrowDownRight,
    PiggyBank,
    Wallet2,
} from "lucide-react";

type RelatoriosPageProps = {
    searchParams?: Promise<{
        year?: string;
        month?: string;
    }>;
};

const months = [
    { value: "", label: "Ano completo" },
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
];

export default async function RelatoriosPage({ searchParams }: RelatoriosPageProps) {
    const params = searchParams ? await searchParams : undefined;
    const data = await getReportsData({
        year: params?.year,
        month: params?.month,
    });

    const years = getAvailableYears();
    const csvFilename = `relatorio-${data.filters.year}${data.filters.month ? `-mes${data.filters.month}` : ""}`;

    const summaryCards = [
        {
            title: "Receitas",
            value: data.summary.totalIncome,
            helper: "Total do período",
            icon: ArrowUpRight,
            iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
            iconColor: "text-emerald-600 dark:text-emerald-400",
        },
        {
            title: "Despesas",
            value: data.summary.totalExpense,
            helper: "Total do período",
            icon: ArrowDownRight,
            iconBg: "bg-rose-100 dark:bg-rose-900/30",
            iconColor: "text-rose-600 dark:text-rose-400",
        },
        {
            title: "Investimentos",
            value: data.summary.totalInvestments,
            helper: "Total do período",
            icon: PiggyBank,
            iconBg: "bg-blue-100 dark:bg-blue-900/30",
            iconColor: "text-blue-600 dark:text-blue-400",
        },
        {
            title: "Saldo",
            value: data.summary.balance,
            helper: "Receitas - despesas - investimentos",
            icon: Wallet2,
            iconBg: "bg-violet-100 dark:bg-violet-900/30",
            iconColor: "text-violet-600 dark:text-violet-400",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
            <div className="flex min-h-screen">
                <Sidebar />

                <div className="flex min-w-0 flex-1 flex-col">
                    <Header userName={data.user.name} />

                    <main className="flex-1 p-6 lg:p-8">
                        <div className="mx-auto max-w-[1600px] space-y-6">
                            {/* Título e filtros */}
                            <div className="flex flex-wrap items-end justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                        Relatórios
                                    </h1>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Análise detalhada das suas finanças por período.
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <ReportsCsvButton rows={data.csvRows} filename={csvFilename} />
                                </div>
                            </div>

                            {/* Filtros de período */}
                            <form
                                method="GET"
                                className="flex flex-wrap items-end gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Ano
                                    </label>
                                    <select
                                        name="year"
                                        defaultValue={String(data.filters.year)}
                                        className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                                    >
                                        {years.map((y) => (
                                            <option key={y} value={String(y)}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Mês
                                    </label>
                                    <select
                                        name="month"
                                        defaultValue={String(data.filters.month ?? "")}
                                        className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                                    >
                                        {months.map((m) => (
                                            <option key={m.value} value={m.value}>
                                                {m.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="inline-flex h-10 items-center justify-center rounded-2xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                                >
                                    Filtrar
                                </button>
                            </form>

                            {/* Cards de resumo */}
                            <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
                                {summaryCards.map((card) => {
                                    const Icon = card.icon;
                                    return (
                                        <div
                                            key={card.title}
                                            className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        {card.title}
                                                    </p>
                                                    <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                                        {formatCurrency(card.value)}
                                                    </h3>
                                                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                                        {card.helper}
                                                    </p>
                                                </div>
                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor}`}
                                                >
                                                    <Icon size={22} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </section>

                            {/* Gráficos */}
                            <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.7fr)_420px]">
                                <MonthlyChart data={data.monthlyBreakdown} />
                                <ExpensesByCategoryChart data={data.expensesByCategory} />
                            </section>

                            {/* Receitas por categoria */}
                            {data.incomeByCategory.length > 0 && (
                                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                        Receitas por categoria
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Distribuição das entradas no período.
                                    </p>

                                    <div className="mt-4 space-y-3">
                                        {data.incomeByCategory.map((item) => {
                                            const pct = data.summary.totalIncome > 0
                                                ? (item.value / data.summary.totalIncome) * 100
                                                : 0;

                                            return (
                                                <div key={item.name} className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-700 dark:text-slate-300">
                                                            {item.name}
                                                        </span>
                                                        <span className="font-medium text-slate-900 dark:text-slate-100">
                                                            {formatCurrency(item.value)}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                                        <div
                                                            className="h-full rounded-full bg-emerald-500"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Despesas por categoria (tabela) */}
                            {data.expensesByCategory.length > 0 && (
                                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                        Despesas por categoria
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Distribuição dos gastos no período.
                                    </p>

                                    <div className="mt-4 space-y-3">
                                        {data.expensesByCategory.map((item) => {
                                            const pct = data.summary.totalExpense > 0
                                                ? (item.value / data.summary.totalExpense) * 100
                                                : 0;

                                            return (
                                                <div key={item.name} className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-700 dark:text-slate-300">
                                                            {item.name}
                                                        </span>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-slate-500 dark:text-slate-400">
                                                                {pct.toFixed(1)}%
                                                            </span>
                                                            <span className="font-medium text-slate-900 dark:text-slate-100">
                                                                {formatCurrency(item.value)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                                        <div
                                                            className="h-full rounded-full bg-rose-500"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
