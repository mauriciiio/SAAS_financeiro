"use server";

import { prisma } from "@/lib/prisma";
import { CategoryType, TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createTransaction(formData: FormData) {
  try {
    const title = String(formData.get("title") || "").trim();
    const amountRaw = String(formData.get("amount") || "").trim();
    const dateRaw = String(formData.get("date") || "").trim();
    const typeRaw = String(formData.get("type") || "").trim();
    const categoryId = String(formData.get("categoryId") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const isFixed = formData.get("isFixed") === "on";

    if (!title || !amountRaw || !dateRaw || !typeRaw || !categoryId) {
      return { success: false, message: "Preencha os campos obrigatórios." };
    }

    const amount = Number(amountRaw.replace(",", "."));

    if (Number.isNaN(amount) || amount <= 0) {
      return { success: false, message: "Valor inválido." };
    }

    if (typeRaw !== "INCOME" && typeRaw !== "EXPENSE") {
      return { success: false, message: "Tipo de lançamento inválido." };
    }

    const user = await prisma.user.findFirstOrThrow({
      where: { email: "local@financeapp.dev" },
    });

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: user.id,
      },
    });

    if (!category) {
      return { success: false, message: "Categoria não encontrada." };
    }

    const expectedCategoryType =
      typeRaw === "INCOME" ? CategoryType.INCOME : CategoryType.EXPENSE;

    if (category.type !== expectedCategoryType) {
      return {
        success: false,
        message: "A categoria não corresponde ao tipo do lançamento.",
      };
    }

    await prisma.transaction.create({
      data: {
        userId: user.id,
        categoryId,
        title,
        description: description || null,
        type: typeRaw as TransactionType,
        amount,
        date: new Date(dateRaw),
        isFixed,
        isPaid: true,
      },
    });

    revalidatePath("/lancamentos");
    revalidatePath("/dashboard");

    return { success: true, message: "Lançamento salvo com sucesso." };
  } catch {
    return { success: false, message: "Erro ao salvar lançamento." };
  }
}