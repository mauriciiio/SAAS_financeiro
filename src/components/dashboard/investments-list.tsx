import { EditInvestmentDialog } from "@/components/forms/edit-investment-dialog";
import { DeleteInvestmentForm } from "@/components/forms/delete-investment-form";
import { formatCurrency } from "@/lib/format";

type InvestmentItem = {
    id: string;
    title: string;
    institution: string | null;
    assetType: string | null;
    amount: number;
    date: Date;
    notes: string | null;
};

type InvestmentsListProps = {
    investments: InvestmentItem[];
};

export function InvestmentsList({ investments }: InvestmentsListProps) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Aportes</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Lista dos investimentos cadastrados.
                </p>
            </div>

            <div className="space-y-3">
                {investments.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
                        Nenhum aporte cadastrado ainda.
                    </div>
                ) : (
                    investments.map((investment) => (
                        <div
                            key={investment.id}
                            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-700/50"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {investment.title}
                                </p>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {[investment.assetType, investment.institution]
                                        .filter(Boolean)
                                        .join(" • ") || "Sem detalhes"}{" "}
                                    • {new Intl.DateTimeFormat("pt-BR").format(investment.date)}
                                </p>

                                {investment.notes && (
                                    <p className="mt-1 truncate text-xs text-slate-400 dark:text-slate-500">
                                        {investment.notes}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-sm font-semibold text-blue-600">
                                    - {formatCurrency(investment.amount)}
                                </div>

                                <EditInvestmentDialog
                                    investment={{
                                        id: investment.id,
                                        title: investment.title,
                                        institution: investment.institution,
                                        assetType: investment.assetType,
                                        amount: investment.amount,
                                        date: investment.date,
                                        notes: investment.notes,
                                    }}
                                />

                                <DeleteInvestmentForm id={investment.id} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}