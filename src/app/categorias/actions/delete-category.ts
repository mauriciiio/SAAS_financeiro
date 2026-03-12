"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteCategory(formData: FormData) {
  try {
    const id = String(formData.get("id") || "").trim();

    if (!id) {
      return { success: false, message: "Categoria inválida." };
    }

    const user = await prisma.user.findFirstOrThrow({
      where: { email: "local@financeapp.dev" },
    });

    const category = await prisma.category.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!category) {
      return { success: false, message: "Categoria não encontrada." };
    }

    const linkedTransactions = await prisma.transaction.count({
      where: {
        categoryId: category.id,
      },
    });

    if (linkedTransactions > 0) {
      return {
        success: false,
        message: "Não é possível excluir uma categoria que já possui lançamentos.",
      };
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/categorias");
    revalidatePath("/lancamentos");
    revalidatePath("/dashboard");

    return { success: true, message: "Categoria excluída com sucesso." };
  } catch {
    return { success: false, message: "Erro ao excluir categoria." };
  }
}