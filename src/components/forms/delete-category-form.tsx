"use client";

import { toast } from "sonner";
import { deleteCategory } from "@/app/categorias/actions/delete-category";
import { DeleteTransactionButton } from "@/components/forms/delete-transaction-button";

type DeleteCategoryFormProps = {
    id: string;
};

export function DeleteCategoryForm({ id }: DeleteCategoryFormProps) {
    async function action(formData: FormData) {
        const result = await deleteCategory(formData);

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