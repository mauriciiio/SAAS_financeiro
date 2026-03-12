import { prisma } from "@/lib/prisma";

export async function getInvestmentsPageData() {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: "local@financeapp.dev" },
  });

  const investments = await prisma.investmentContribution.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      date: "desc",
    },
  });

  const totalInvested = investments.reduce(
    (acc, item) => acc + Number(item.amount),
    0
  );

  return {
    user,
    investments,
    summary: {
      totalInvested,
      totalCount: investments.length,
    },
  };
}