import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

type GetReportsDataParams = {
  year?: string;
  month?: string;
};

export async function getReportsData(params?: GetReportsDataParams) {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: "local@financeapp.dev" },
  });

  const now = new Date();
  const selectedYear = Number(params?.year) || now.getFullYear();
  const selectedMonth = params?.month ? Number(params.month) : undefined;

  let start: Date;
  let end: Date;

  if (selectedMonth) {
    start = new Date(selectedYear, selectedMonth - 1, 1);
    end = new Date(selectedYear, selectedMonth, 1);
  } else {
    start = new Date(selectedYear, 0, 1);
    end = new Date(selectedYear + 1, 0, 1);
  }

  const [transactions, investments] = await Promise.all([
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
  ]);

  const totalIncome = transactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalInvestments = investments.reduce((acc, i) => acc + Number(i.amount), 0);

  // Agrupamento por categoria
  const expensesByCategoryMap = new Map<string, number>();
  const incomeByCategoryMap = new Map<string, number>();

  for (const t of transactions) {
    if (t.type === TransactionType.EXPENSE) {
      const curr = expensesByCategoryMap.get(t.category.name) || 0;
      expensesByCategoryMap.set(t.category.name, curr + Number(t.amount));
    } else {
      const curr = incomeByCategoryMap.get(t.category.name) || 0;
      incomeByCategoryMap.set(t.category.name, curr + Number(t.amount));
    }
  }

  const expensesByCategory = Array.from(expensesByCategoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const incomeByCategory = Array.from(incomeByCategoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Agrupamento por mês
  const monthlyMap = new Map<
    string,
    { label: string; month: number; receitas: number; despesas: number; investimentos: number }
  >();

  const monthsCount = selectedMonth ? 1 : 12;
  for (let m = 0; m < monthsCount; m++) {
    const monthIndex = selectedMonth ? selectedMonth - 1 : m;
    const key = String(monthIndex);
    const label = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(
      new Date(selectedYear, monthIndex, 1)
    );
    monthlyMap.set(key, {
      label: label.charAt(0).toUpperCase() + label.slice(1).replace(".", ""),
      month: monthIndex + 1,
      receitas: 0,
      despesas: 0,
      investimentos: 0,
    });
  }

  for (const t of transactions) {
    const key = String(t.date.getMonth());
    const entry = monthlyMap.get(key);
    if (!entry) continue;
    if (t.type === TransactionType.INCOME) entry.receitas += Number(t.amount);
    else entry.despesas += Number(t.amount);
  }

  for (const i of investments) {
    const key = String(i.date.getMonth());
    const entry = monthlyMap.get(key);
    if (entry) entry.investimentos += Number(i.amount);
  }

  const monthlyBreakdown = Array.from(monthlyMap.values()).map((item) => ({
    month: item.label,
    receitas: item.receitas,
    despesas: item.despesas,
    investimentos: item.investimentos,
  }));

  // Dados para exportação CSV
  const csvRows = [
    ...transactions.map((t) => ({
      data: t.date.toLocaleDateString("pt-BR"),
      tipo: t.type === TransactionType.INCOME ? "Receita" : "Despesa",
      titulo: t.title,
      categoria: t.category.name,
      valor: Number(t.amount),
      descricao: t.description || "",
    })),
    ...investments.map((i) => ({
      data: i.date.toLocaleDateString("pt-BR"),
      tipo: "Investimento",
      titulo: i.title,
      categoria: i.institution || "Investimento",
      valor: Number(i.amount),
      descricao: i.notes || "",
    })),
  ].sort((a, b) => b.data.localeCompare(a.data));

  return {
    user,
    filters: {
      year: selectedYear,
      month: selectedMonth,
    },
    summary: {
      totalIncome,
      totalExpense,
      totalInvestments,
      balance: totalIncome - totalExpense - totalInvestments,
    },
    expensesByCategory,
    incomeByCategory,
    monthlyBreakdown,
    csvRows,
  };
}

export function getAvailableYears(): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
}
