"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function applyRecurringTransactions() {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { email: "local@financeapp.dev" },
    });

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

    // Busca lançamentos fixos do mês anterior
    const fixedTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        isFixed: true,
        date: { gte: prevMonthStart, lt: prevMonthEnd },
      },
    });

    if (fixedTransactions.length === 0) {
      return { success: true, message: "Nenhum lançamento fixo encontrado no mês anterior.", count: 0 };
    }

    // Busca lançamentos já existentes no mês atual
    const existingThisMonth = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: { gte: currentMonthStart, lt: currentMonthEnd },
      },
      select: { title: true, categoryId: true, type: true },
    });

    const existingKeys = new Set(
      existingThisMonth.map((t) => `${t.title}|${t.categoryId}|${t.type}`)
    );

    // Filtra apenas os que ainda não foram criados este mês
    const toCreate = fixedTransactions.filter((t) => {
      const key = `${t.title}|${t.categoryId}|${t.type}`;
      return !existingKeys.has(key);
    });

    if (toCreate.length === 0) {
      return {
        success: true,
        message: "Todos os lançamentos fixos já foram aplicados neste mês.",
        count: 0,
      };
    }

    // Cria os lançamentos no mês atual (mantendo o mesmo dia do mês anterior)
    await prisma.transaction.createMany({
      data: toCreate.map((t) => {
        const originalDay = t.date.getDate();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const targetDay = Math.min(originalDay, daysInMonth);
        const newDate = new Date(now.getFullYear(), now.getMonth(), targetDay);

        return {
          userId: user.id,
          categoryId: t.categoryId,
          title: t.title,
          description: t.description,
          type: t.type,
          amount: t.amount,
          date: newDate,
          isFixed: true,
          isPaid: false,
        };
      }),
    });

    revalidatePath("/lancamentos");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `${toCreate.length} lançamento(s) fixo(s) aplicado(s) com sucesso.`,
      count: toCreate.length,
    };
  } catch {
    return { success: false, message: "Erro ao aplicar lançamentos fixos.", count: 0 };
  }
}

export async function getPendingRecurringCount() {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { email: "local@financeapp.dev" },
    });

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

    const fixedTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        isFixed: true,
        date: { gte: prevMonthStart, lt: prevMonthEnd },
      },
      select: { title: true, categoryId: true, type: true },
    });

    const existingThisMonth = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: { gte: currentMonthStart, lt: currentMonthEnd },
      },
      select: { title: true, categoryId: true, type: true },
    });

    const existingKeys = new Set(
      existingThisMonth.map((t) => `${t.title}|${t.categoryId}|${t.type}`)
    );

    const pending = fixedTransactions.filter((t) => {
      const key = `${t.title}|${t.categoryId}|${t.type}`;
      return !existingKeys.has(key);
    });

    return pending.length;
  } catch {
    return 0;
  }
}
