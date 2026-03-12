"use server";

import { prisma } from "@/lib/prisma";
import { CategoryType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  try {
    const name = String(formData.get("name") || "").trim();
    const typeRaw = String(formData.get("type") || "").trim();
    const color = String(formData.get("color") || "").trim();
    const icon = String(formData.get("icon") || "").trim();

    if (!name || !typeRaw) {
      return { success: false, message: "Preencha os campos obrigatórios." };
    }

    if (!["INCOME", "EXPENSE", "INVESTMENT"].includes(typeRaw)) {
      return { success: false, message: "Tipo de categoria inválido." };
    }

    const user = await prisma.user.findFirstOrThrow({
      where: { email: "local@financeapp.dev" },
    });

    const existing = await prisma.category.findFirst({
      where: {
        userId: user.id,
        name,
        type: typeRaw as CategoryType,
      },
    });

    if (existing) {
      return { success: false, message: "Já existe uma categoria com esse nome." };
    }

    await prisma.category.create({
      data: {
        userId: user.id,
        name,
        type: typeRaw as CategoryType,
        color: color || null,
        icon: icon || null,
      },
    });

    revalidatePath("/categorias");
    revalidatePath("/lancamentos");
    revalidatePath("/dashboard");

    return { success: true, message: "Categoria criada com sucesso." };
  } catch {
    return { success: false, message: "Erro ao criar categoria." };
  }
}