"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RefreshCw, X } from "lucide-react";
import { applyRecurringTransactions } from "@/app/lancamentos/actions/apply-recurring-transactions";

type RecurringTransactionsBannerProps = {
    pendingCount: number;
};

export function RecurringTransactionsBanner({ pendingCount }: RecurringTransactionsBannerProps) {
    const [visible, setVisible] = useState(pendingCount > 0);
    const [loading, setLoading] = useState(false);

    if (!visible) return null;

    async function handleApply() {
        setLoading(true);
        const result = await applyRecurringTransactions();
        setLoading(false);

        if (result.success) {
            toast.success(result.message);
            setVisible(false);
        } else {
            toast.error(result.message);
        }
    }

    return (
        <div className="flex items-center justify-between gap-4 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                    <RefreshCw size={16} />
                </div>
                <div>
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                        Lançamentos fixos pendentes
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                        Há {pendingCount} lançamento(s) fixo(s) do mês anterior que ainda não foram aplicados neste mês.
                    </p>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <button
                    onClick={handleApply}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-50 dark:bg-amber-700 dark:hover:bg-amber-600"
                >
                    {loading ? (
                        <>
                            <RefreshCw size={14} className="animate-spin" />
                            Aplicando...
                        </>
                    ) : (
                        <>
                            <RefreshCw size={14} />
                            Aplicar agora
                        </>
                    )}
                </button>

                <button
                    onClick={() => setVisible(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-amber-600 transition hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/40"
                    title="Fechar"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
