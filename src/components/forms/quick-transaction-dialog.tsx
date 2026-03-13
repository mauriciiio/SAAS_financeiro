"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TransactionForm } from "@/components/forms/transaction-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type Category = { id: string; name: string };

type QuickTransactionDialogProps = {
    incomeCategories: Category[];
    expenseCategories: Category[];
};

export function QuickTransactionDialog({
    incomeCategories,
    expenseCategories,
}: QuickTransactionDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                    <Plus size={16} />
                    Novo lançamento
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[580px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Novo lançamento
                    </DialogTitle>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Cadastre uma receita ou despesa no sistema.
                    </p>
                </DialogHeader>

                <TransactionForm
                    incomeCategories={incomeCategories}
                    expenseCategories={expenseCategories}
                    compact
                    onSuccess={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
