import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export async function getLocalUser() {
  return prisma.user.findFirstOrThrow({
    where: { email: "local@financeapp.dev" },
  });
}

function getMonthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  return { start, end };
}

function getLastMonths(count: number) {
  const now = new Date();
  const months: { start: Date; end: Date; label: string }[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    const label = new Intl.DateTimeFormat("pt-BR", {
      month: "short",
    }).format(start);

    months.push({
      start,
      end,
      label: label.charAt(0).toUpperCase() + label.slice(1).replace(".", ""),
    });
  }

  return months;
}

export async function getDashboardData() {
  const user = await getLocalUser();

  const { start, end } = getMonthRange();

  const lastMonths = getLastMonths(6);
  const evolutionStart = lastMonths[0].start;

  // Busca todos os dados em paralelo com apenas 4 queries (antes eram 12+ queries)
  const [transactions, investments, evolutionTransactions, evolutionInvestments] =
    await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId: user.id,
          date: { gte: start, lt: end },
        },
        include: { category: true },
        orderBy: { date: "desc" },
      }),
      prisma.investmentContribution.findMany({
        where: {
          userId: user.id,
          date: { gte: start, lt: end },
        },
        orderBy: { date: "desc" },
      }),
      prisma.transaction.findMany({
        where: {
          userId: user.id,
          date: { gte: evolutionStart, lt: end },
        },
      }),
      prisma.investmentContribution.findMany({
        where: {
          userId: user.id,
          date: { gte: evolutionStart, lt: end },
        },
      }),
    ]);

  const totalIncome = transactions
    .filter((item) => item.type === TransactionType.INCOME)
    .reduce((acc, item) => acc + Number(item.amount), 0);

  const totalExpense = transactions
    .filter((item) => item.type === TransactionType.EXPENSE)
    .reduce((acc, item) => acc + Number(item.amount), 0);

  const totalInvestments = investments.reduce(
    (acc, item) => acc + Number(item.amount),
    0
  );

  const balance = totalIncome - totalExpense - totalInvestments;

  const expensesByCategoryMap = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.type !== TransactionType.EXPENSE) continue;

    const current = expensesByCategoryMap.get(transaction.category.name) || 0;
    expensesByCategoryMap.set(
      transaction.category.name,
      current + Number(transaction.amount)
    );
  }

  const expensesByCategory = Array.from(expensesByCategoryMap.entries())
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  // Agrega dados dos 6 meses em memória (evita N+1 queries)
  const monthlyEvolution = lastMonths.map((month) => {
    const monthTransactions = evolutionTransactions.filter(
      (t) => t.date >= month.start && t.date < month.end
    );

    const monthInvestments = evolutionInvestments.filter(
      (i) => i.date >= month.start && i.date < month.end
    );

    const income = monthTransactions
      .filter((item) => item.type === TransactionType.INCOME)
      .reduce((acc, item) => acc + Number(item.amount), 0);

    const expense = monthTransactions
      .filter((item) => item.type === TransactionType.EXPENSE)
      .reduce((acc, item) => acc + Number(item.amount), 0);

    const investment = monthInvestments.reduce(
      (acc, item) => acc + Number(item.amount),
      0
    );

    return {
      month: month.label,
      receitas: income,
      despesas: expense,
      investimentos: investment,
    };
  });

  const recentTransactions = [
    ...transactions.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category.name,
      amount: Number(item.amount),
      type: item.type === TransactionType.INCOME ? "income" : "expense",
      date: item.date,
    })),
    ...investments.map((item) => ({
      id: item.id,
      title: item.title,
      category: "Investimento",
      amount: Number(item.amount),
      type: "investment" as const,
      date: item.date,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6);

  return {
    user,
    summary: {
      totalIncome,
      totalExpense,
      totalInvestments,
      balance,
    },
    expensesByCategory,
    monthlyEvolution,
    recentTransactions,
  };
}
