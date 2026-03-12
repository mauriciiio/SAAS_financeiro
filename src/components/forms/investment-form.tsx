"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createInvestment } from "@/app/investimentos/actions/create-investment";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";

export function InvestmentForm() {
    const [formKey, setFormKey] = useState(0);
    const today = new Date().toISOString().split("T")[0];

    async function action(formData: FormData) {
        const result = await createInvestment(formData);

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
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Novo aporte</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Cadastre um novo investimento no sistema.
                </p>
            </div>

            <div className="grid gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Título</label>
                    <Input name="title" placeholder="Ex.: Aporte Tesouro Selic" required />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Instituição</label>
                    <Input name="institution" placeholder="Ex.: Nubank, XP, Inter..." />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tipo do ativo</label>
                    <Input name="assetType" placeholder="Ex.: Renda Fixa, ETF, Ações..." />
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

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Observações</label>
                    <textarea
                        name="notes"
                        placeholder="Observações opcionais"
                        className="min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <SubmitButton pendingText="Salvando...">
                    Salvar aporte
                </SubmitButton>
            </div>
        </form>
    );
}