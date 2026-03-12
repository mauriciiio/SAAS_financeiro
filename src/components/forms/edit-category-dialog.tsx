"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { updateCategory } from "@/app/categorias/actions/update-category";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type EditCategoryDialogProps = {
    category: {
        id: string;
        name: string;
        type: "INCOME" | "EXPENSE" | "INVESTMENT";
        color: string | null;
        icon: string | null;
    };
};

export function EditCategoryDialog({ category }: EditCategoryDialogProps) {
    const [open, setOpen] = useState(false);

    async function action(formData: FormData) {
        const result = await updateCategory(formData);

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
                    title="Editar categoria"
                >
                    <Pencil size={16} />
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[620px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle>Editar categoria</DialogTitle>
                </DialogHeader>

                <form action={action} className="mt-4 grid gap-4">
                    <input type="hidden" name="id" value={category.id} />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Nome</label>
                        <Input name="name" defaultValue={category.name} required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Tipo</label>
                        <select
                            name="type"
                            defaultValue={category.type}
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                        >
                            <option value="INCOME">Receita</option>
                            <option value="EXPENSE">Despesa</option>
                            <option value="INVESTMENT">Investimento</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Cor</label>
                        <Input name="color" defaultValue={category.color || ""} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Ícone</label>
                        <Input name="icon" defaultValue={category.icon || ""} />
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