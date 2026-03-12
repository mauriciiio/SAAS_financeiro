"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteInvestment(formData: FormData) {
  try {
    const id = String(formData.get("id") || "").trim();

    if (!id) {
      return { success: false, message: "Aporte inválido." };
    }

    const user = await prisma.user.findFirstOrThrow({
      where: { email: "local@financeapp.dev" },
    });

    const investment = await prisma.investmentContribution.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!investment) {
      return { success: false, message: "Aporte não encontrado." };
    }

    await prisma.investmentContribution.delete({
      where: { id },
    });

    revalidatePath("/investimentos");
    revalidatePath("/dashboard");

    return { success: true, message: "Aporte excluído com sucesso." };
  } catch {
    return { success: false, message: "Erro ao excluir aporte." };
  }
}