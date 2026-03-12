"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateInvestment(formData: FormData) {
  try {
    const id = String(formData.get("id") || "").trim();
    const title = String(formData.get("title") || "").trim();
    const institution = String(formData.get("institution") || "").trim();
    const assetType = String(formData.get("assetType") || "").trim();
    const amountRaw = String(formData.get("amount") || "").trim();
    const dateRaw = String(formData.get("date") || "").trim();
    const notes = String(formData.get("notes") || "").trim();

    if (!id || !title || !amountRaw || !dateRaw) {
      return { success: false, message: "Preencha os campos obrigatórios." };
    }

    const amount = Number(amountRaw.replace(",", "."));

    if (Number.isNaN(amount) || amount <= 0) {
      return { success: false, message: "Valor inválido." };
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

    await prisma.investmentContribution.update({
      where: { id },
      data: {
        title,
        institution: institution || null,
        assetType: assetType || null,
        amount,
        date: new Date(dateRaw),
        notes: notes || null,
      },
    });

    revalidatePath("/investimentos");
    revalidatePath("/dashboard");

    return { success: true, message: "Aporte atualizado com sucesso." };
  } catch {
    return { success: false, message: "Erro ao atualizar aporte." };
  }
}