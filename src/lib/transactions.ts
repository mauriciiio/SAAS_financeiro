import { prisma } from "@/lib/prisma";
import { CategoryType, TransactionType } from "@prisma/client";

type GetTransactionsPageDataParams = {
  type?: string;
  category?: string;
  month?: string;
  year?: string;
};

function getMonthRange(month?: string, year?: string) {
  const now = new Date();

  const parsedMonth = Number(month);
  const parsedYear = Number(year);

  const selectedMonth =
    Number.isInteger(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12
      ? parsedMonth
      : now.getMonth() + 1;

  const selectedYear =
    Number.isInteger(parsedYear) && parsedYear >= 2000 && parsedYear <= 2100
      ? parsedYear
      : now.getFullYear();

  const start = new Date(selectedYear, selectedMonth - 1, 1);
  const end = new Date(selectedYear, selectedMonth, 1);

  return {
    start,
    end,
    selectedMonth: String(selectedMonth),
    selectedYear: String(selectedYear),
  };
}

export async function getTransactionsPageData(
  params?: GetTransactionsPageDataParams
) {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: "local@financeapp.dev" },
  });

  const typeFilter =
    params?.type === "INCOME" || params?.type === "EXPENSE"
      ? params.type
      : undefined;

  const categoryFilter = params?.category?.trim() || undefined;

  const { start, end, selectedMonth, selectedYear } = getMonthRange(
    params?.month,
    params?.year
  );

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      ...(typeFilter ? { type: typeFilter as TransactionType } : {}),
      ...(categoryFilter ? { categoryId: categoryFilter } : {}),
      date: {
        gte: start,
        lt: end,
      },
    },
    include: {
      category: true,
    },
    orderBy: [
      { date: "desc" },
      { createdAt: "desc" },
    ],
  });

  const incomeCategories = await prisma.category.findMany({
    where: {
      userId: user.id,
      type: CategoryType.INCOME,
    },
    orderBy: {
      name: "asc",
    },
  });

  const expenseCategories = await prisma.category.findMany({
    where: {
      userId: user.id,
      type: CategoryType.EXPENSE,
    },
    orderBy: {
      name: "asc",
    },
  });

  const allCategories = await prisma.category.findMany({
    where: {
      userId: user.id,
      type: {
        in: [CategoryType.INCOME, CategoryType.EXPENSE],
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const totalIncome = transactions
    .filter((item) => item.type === TransactionType.INCOME)
    .reduce((acc, item) => acc + Number(item.amount), 0);

  const totalExpense = transactions
    .filter((item) => item.type === TransactionType.EXPENSE)
    .reduce((acc, item) => acc + Number(item.amount), 0);

  return {
    user,
    transactions,
    incomeCategories,
    expenseCategories,
    allCategories,
    filters: {
      type: typeFilter || "",
      category: categoryFilter || "",
      month: selectedMonth,
      year: selectedYear,
    },
    summary: {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    },
  };
}