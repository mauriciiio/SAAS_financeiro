"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function DeleteTransactionButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            onClick={(e) => {
                const confirmed = window.confirm("Deseja realmente excluir este lançamento?");
                if (!confirmed) {
                    e.preventDefault();
                }
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-rose-600 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-rose-400"
            title="Excluir lançamento"
        >
            <Trash2 size={16} />
        </button>
    );
}