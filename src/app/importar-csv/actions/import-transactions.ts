"use server";

import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { parseLocalDate } from "@/lib/format";

export type CsvTransactionInput = {
    referenceId: string;
    title: string;
    date: string; // YYYY-MM-DD
    amount: number; // always positive
    type: "INCOME" | "EXPENSE";
    categoryId: string;
};

export async function importCsvTransactions(transactions: CsvTransactionInput[]) {
    if (transactions.length === 0) {
        return { success: true, imported: 0, skipped: 0 };
    }

    const user = await prisma.user.findFirstOrThrow({
        where: { email: "local@financeapp.dev" },
    });

    let imported = 0;
    let skipped = 0;

    for (const tx of transactions) {
        try {
            await prisma.transaction.upsert({
                where: { referenceId: tx.referenceId },
                create: {
                    userId: user.id,
                    categoryId: tx.categoryId,
                    title: tx.title,
                    type: tx.type as TransactionType,
                    amount: tx.amount,
                    date: parseLocalDate(tx.date),
                    isFixed: false,
                    isPaid: true,
                    referenceId: tx.referenceId,
                },
                update: {},
            });
            imported++;
        } catch {
            skipped++;
        }
    }

    revalidatePath("/lancamentos");
    revalidatePath("/dashboard");

    return { success: true, imported, skipped };
}
