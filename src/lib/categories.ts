import { prisma } from "@/lib/prisma";
import { CategoryType } from "@prisma/client";

export async function getCategoriesPageData() {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: "local@financeapp.dev" },
  });

  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
    },
    orderBy: [
      { type: "asc" },
      { name: "asc" },
    ],
  });

  const incomeCategories = categories.filter(
    (item) => item.type === CategoryType.INCOME
  );

  const expenseCategories = categories.filter(
    (item) => item.type === CategoryType.EXPENSE
  );

  const investmentCategories = categories.filter(
    (item) => item.type === CategoryType.INVESTMENT
  );

  return {
    user,
    categories,
    grouped: {
      incomeCategories,
      expenseCategories,
      investmentCategories,
    },
    summary: {
      total: categories.length,
      income: incomeCategories.length,
      expense: expenseCategories.length,
      investment: investmentCategories.length,
    },
  };
}