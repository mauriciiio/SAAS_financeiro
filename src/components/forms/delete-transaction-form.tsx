"use client";

import { toast } from "sonner";
import { deleteTransaction } from "@/app/lancamentos/actions/delete-transaction";
import { DeleteTransactionButton } from "@/components/forms/delete-transaction-button";

type DeleteTransactionFormProps = {
    id: string;
};

export function DeleteTransactionForm({ id }: DeleteTransactionFormProps) {
    async function action(formData: FormData) {
        const result = await deleteTransaction(formData);

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