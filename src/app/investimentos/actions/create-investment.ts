"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createInvestment(formData: FormData) {
  try {
    const title = String(formData.get("title") || "").trim();
    const institution = String(formData.get("institution") || "").trim();
    const assetType = String(formData.get("assetType") || "").trim();
    const amountRaw = String(formData.get("amount") || "").trim();
    const dateRaw = String(formData.get("date") || "").trim();
    const notes = String(formData.get("notes") || "").trim();

    if (!title || !amountRaw || !dateRaw) {
      return { success: false, message: "Preencha os campos obrigatórios." };
    }

    const amount = Number(amountRaw.replace(",", "."));

    if (Number.isNaN(amount) || amount <= 0) {
      return { success: false, message: "Valor inválido." };
    }

    const user = await prisma.user.findFirstOrThrow({
      where: { email: "local@financeapp.dev" },
    });

    await prisma.investmentContribution.create({
      data: {
        userId: user.id,
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

    return { success: true, message: "Aporte salvo com sucesso." };
  } catch {
    return { success: false, message: "Erro ao salvar aporte." };
  }
}