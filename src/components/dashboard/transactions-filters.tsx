type Category = {
    id: string;
    name: string;
};

type TransactionsFiltersProps = {
    categories: Category[];
    selectedType: string;
    selectedCategory: string;
    selectedMonth: string;
    selectedYear: string;
};

const months = [
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

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 6 }, (_, index) => String(currentYear - index));

export function TransactionsFilters({
    categories,
    selectedType,
    selectedCategory,
    selectedMonth,
    selectedYear,
}: TransactionsFiltersProps) {
    return (
        <form
            method="GET"
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
        >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Tipo</label>
                    <select
                        name="type"
                        defaultValue={selectedType}
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                    >
                        <option value="">Todos</option>
                        <option value="INCOME">Receitas</option>
                        <option value="EXPENSE">Despesas</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Categoria</label>
                    <select
                        name="category"
                        defaultValue={selectedCategory}
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                    >
                        <option value="">Todas</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Mês</label>
                    <select
                        name="month"
                        defaultValue={selectedMonth}
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                    >
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Ano</label>
                    <select
                        name="year"
                        defaultValue={selectedYear}
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-end gap-3">
                    <button
                        type="submit"
                        className="inline-flex h-10 items-center justify-center rounded-2xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                        Filtrar
                    </button>

                    <a
                        href="/lancamentos"
                        className="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Limpar
                    </a>
                </div>
            </div>
        </form>
    );
}