"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { updateTransaction } from "@/app/lancamentos/actions/update-transaction";
import { formatDateForInput } from "@/lib/format";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type Category = {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
};

type EditTransactionDialogProps = {
    transaction: {
        id: string;
        title: string;
        description: string | null;
        amount: number;
        date: Date;
        type: "INCOME" | "EXPENSE";
        isFixed: boolean;
        categoryId: string;
    };
    categories: Category[];
};

export function EditTransactionDialog({
    transaction,
    categories,
}: EditTransactionDialogProps) {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<"INCOME" | "EXPENSE">(transaction.type);
    const [selectedCategoryId, setSelectedCategoryId] = useState(transaction.categoryId);

    const filteredCategories = useMemo(() => {
        return categories.filter((category) => category.type === type);
    }, [categories, type]);

    useEffect(() => {
        const exists = filteredCategories.some((item) => item.id === selectedCategoryId);

        if (!exists) {
            setSelectedCategoryId(filteredCategories[0]?.id || "");
        }
    }, [filteredCategories, selectedCategoryId]);

    const defaultDate = formatDateForInput(new Date(transaction.date));

    async function action(formData: FormData) {
        const result = await updateTransaction(formData);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-slate-100"
                    title="Editar lançamento"
                >
                    <Pencil size={16} />
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[620px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle>Editar lançamento</DialogTitle>
                </DialogHeader>

                <form action={action} className="mt-4 grid gap-4 md:grid-cols-2">
                    <input type="hidden" name="id" value={transaction.id} />

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Título</label>
                        <Input name="title" defaultValue={transaction.title} required />
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
                            {filteredCategories.map((category) => (
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
                            defaultValue={transaction.amount}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Data</label>
                        <Input name="date" type="date" defaultValue={defaultDate} required />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Descrição</label>
                        <textarea
                            name="description"
                            defaultValue={transaction.description || ""}
                            className="min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 md:col-span-2">
                        <input type="checkbox" name="isFixed" defaultChecked={transaction.isFixed} />
                        Lançamento fixo
                    </label>

                    <div className="md:col-span-2 flex justify-end">
                        <SubmitButton pendingText="Salvando alterações...">
                            Salvar alterações
                        </SubmitButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
