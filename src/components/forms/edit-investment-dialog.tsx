"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { updateInvestment } from "@/app/investimentos/actions/update-investment";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type EditInvestmentDialogProps = {
    investment: {
        id: string;
        title: string;
        institution: string | null;
        assetType: string | null;
        amount: number;
        date: Date;
        notes: string | null;
    };
};

export function EditInvestmentDialog({
    investment,
}: EditInvestmentDialogProps) {
    const [open, setOpen] = useState(false);
    const defaultDate = new Date(investment.date).toISOString().split("T")[0];

    async function action(formData: FormData) {
        const result = await updateInvestment(formData);

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
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                    title="Editar aporte"
                >
                    <Pencil size={16} />
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[620px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle>Editar aporte</DialogTitle>
                </DialogHeader>

                <form action={action} className="mt-4 grid gap-4">
                    <input type="hidden" name="id" value={investment.id} />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Título</label>
                        <Input name="title" defaultValue={investment.title} required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Instituição</label>
                        <Input name="institution" defaultValue={investment.institution || ""} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Tipo do ativo</label>
                        <Input name="assetType" defaultValue={investment.assetType || ""} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Valor</label>
                        <Input
                            name="amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            defaultValue={investment.amount}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Data</label>
                        <Input name="date" type="date" defaultValue={defaultDate} required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Observações</label>
                        <textarea
                            name="notes"
                            defaultValue={investment.notes || ""}
                            className="min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                        />
                    </div>

                    <div className="flex justify-end">
                        <SubmitButton pendingText="Salvando alterações...">
                            Salvar alterações
                        </SubmitButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}