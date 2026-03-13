"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createTransaction } from "@/app/lancamentos/actions/create-transaction";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/forms/submit-button";

type Category = {
    id: string;
    name: string;
};

type TransactionFormProps = {
    incomeCategories: Category[];
    expenseCategories: Category[];
    onSuccess?: () => void;
    compact?: boolean;
};

export function TransactionForm({
    incomeCategories,
    expenseCategories,
    onSuccess,
    compact = false,
}: TransactionFormProps) {
    const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [formKey, setFormKey] = useState(0);

    const categories = useMemo(() => {
        return type === "INCOME" ? incomeCategories : expenseCategories;
    }, [type, incomeCategories, expenseCategories]);

    useEffect(() => {
        if (categories.length > 0) {
            setSelectedCategoryId(categories[0].id);
        } else {
            setSelectedCategoryId("");
        }
    }, [categories]);

    const today = new Date().toISOString().split("T")[0];

    async function action(formData: FormData) {
        const result = await createTransaction(formData);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        setFormKey((prev) => prev + 1);
        setType("EXPENSE");
        onSuccess?.();
    }

    return (
        <form
            key={formKey}
            action={action}
            className={compact ? "space-y-0" : "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"}
        >
            {!compact && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Novo lançamento</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Cadastre uma receita ou despesa no sistema.
                    </p>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Título</label>
                    <Input name="title" placeholder="Ex.: Mercado, salário, aluguel..." required />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tipo</label>
                    <select
                        name="type"
                        value={type}
                        onChange={(e) => setType(e.target.value as "INCOME" | "EXPENSE")}
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                    >
                        <option value="EXPENSE">Despesa</option>
                        <option value="INCOME">Receita</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Categoria</label>
                    <select
                        name="categoryId"
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                        required
                    >
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Valor</label>
                    <Input
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Data</label>
                    <Input name="date" type="date" defaultValue={today} required />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Descrição</label>
                    <textarea
                        name="description"
                        placeholder="Observações opcionais"
                        className="min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                    />
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 md:col-span-2">
                    <input type="checkbox" name="isFixed" />
                    Lançamento fixo
                </label>
            </div>

            <div className="mt-6 flex justify-end">
                <SubmitButton pendingText="Salvando...">
                    Salvar lançamento
                </SubmitButton>
            </div>
        </form>
    );
}