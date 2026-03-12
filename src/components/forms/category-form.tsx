"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createCategory } from "@/app/categorias/actions/create-category";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";

export function CategoryForm() {
    const [formKey, setFormKey] = useState(0);

    async function action(formData: FormData) {
        const result = await createCategory(formData);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        setFormKey((prev) => prev + 1);
    }

    return (
        <form
            key={formKey}
            action={action}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Nova categoria</h3>
                <p className="mt-1 text-sm text-slate-500">
                    Cadastre uma nova categoria para o sistema.
                </p>
            </div>

            <div className="grid gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Nome</label>
                    <Input name="name" placeholder="Ex.: Academia, Dividendos..." required />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Tipo</label>
                    <select
                        name="type"
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                        defaultValue="EXPENSE"
                    >
                        <option value="INCOME">Receita</option>
                        <option value="EXPENSE">Despesa</option>
                        <option value="INVESTMENT">Investimento</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Cor</label>
                    <Input name="color" placeholder="Ex.: #22c55e" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Ícone</label>
                    <Input name="icon" placeholder="Ex.: wallet, home, chart..." />
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <SubmitButton pendingText="Salvando...">
                    Salvar categoria
                </SubmitButton>
            </div>
        </form>
    );
}