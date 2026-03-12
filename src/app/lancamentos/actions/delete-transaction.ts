"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteTransaction(formData: FormData) {
  try {
    const id = String(formData.get("id") || "").trim();

    if (!id) {
      return { success: false, message: "Lançamento inválido." };
    }

    const user = await prisma.user.findFirstOrThrow({
      where: { email: "local@financeapp.dev" },
    });

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!transaction) {
      return { success: false, message: "Lançamento não encontrado." };
    }

    await prisma.transaction.delete({
      where: { id },
    });

    revalidatePath("/lancamentos");
    revalidatePath("/dashboard");

    return { success: true, message: "Lançamento excluído com sucesso." };
  } catch {
    return { success: false, message: "Erro ao excluir lançamento." };
  }
}