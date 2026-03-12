"use client";

import { toast } from "sonner";
import { deleteInvestment } from "@/app/investimentos/actions/delete-investment";
import { DeleteTransactionButton } from "@/components/forms/delete-transaction-button";

type DeleteInvestmentFormProps = {
    id: string;
};

export function DeleteInvestmentForm({ id }: DeleteInvestmentFormProps) {
    async function action(formData: FormData) {
        const result = await deleteInvestment(formData);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
    }

    return (
        <form action={action}>
            <input type="hidden" name="id" value={id} />
            <DeleteTransactionButton />
        </form>
    );
}