"use server";

import { prisma } from "@/lib/prisma";

export async function checkExistingReferences(referenceIds: string[]): Promise<string[]> {
    if (referenceIds.length === 0) return [];

    const existing = await prisma.transaction.findMany({
        where: { referenceId: { in: referenceIds } },
        select: { referenceId: true },
    });

    return existing.map((t) => t.referenceId!).filter(Boolean);
}
