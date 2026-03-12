import { PrismaClient, CategoryType, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingUser = await prisma.user.findFirst({
    where: { email: "local@financeapp.dev" },
  });

  let user = existingUser;

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Maurício",
        email: "local@financeapp.dev",
      },
    });
  }

  const categoriesData = [
    { name: "Salário", type: CategoryType.INCOME, color: "#22c55e" },
    { name: "Renda extra", type: CategoryType.INCOME, color: "#16a34a" },

    { name: "Moradia", type: CategoryType.EXPENSE, color: "#ef4444" },
    { name: "Alimentação", type: CategoryType.EXPENSE, color: "#f97316" },
    { name: "Transporte", type: CategoryType.EXPENSE, color: "#eab308" },
    { name: "Lazer", type: CategoryType.EXPENSE, color: "#ec4899" },

    { name: "Reserva", type: CategoryType.INVESTMENT, color: "#3b82f6" },
    { name: "Tesouro", type: CategoryType.INVESTMENT, color: "#2563eb" },
  ];

  for (const category of categoriesData) {
    await prisma.category.upsert({
      where: {
        userId_name_type: {
          userId: user.id,
          name: category.name,
          type: category.type,
        },
      },
      update: {
        color: category.color,
      },
      create: {
        userId: user.id,
        name: category.name,
        type: category.type,
        color: category.color,
      },
    });
  }

  const salaryCategory = await prisma.category.findFirstOrThrow({
    where: { userId: user.id, name: "Salário", type: CategoryType.INCOME },
  });

  const moradiaCategory = await prisma.category.findFirstOrThrow({
    where: { userId: user.id, name: "Moradia", type: CategoryType.EXPENSE },
  });

  const alimentacaoCategory = await prisma.category.findFirstOrThrow({
    where: { userId: user.id, name: "Alimentação", type: CategoryType.EXPENSE },
  });

  const transporteCategory = await prisma.category.findFirstOrThrow({
    where: { userId: user.id, name: "Transporte", type: CategoryType.EXPENSE },
  });

  const lazerCategory = await prisma.category.findFirstOrThrow({
    where: { userId: user.id, name: "Lazer", type: CategoryType.EXPENSE },
  });

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const dates = {
    d1: new Date(year, month, 5),
    d2: new Date(year, month, 8),
    d3: new Date(year, month, 10),
    d4: new Date(year, month, 15),
    d5: new Date(year, month, 20),
  };

  const transactionsData = [
    {
      title: "Salário mensal",
      type: TransactionType.INCOME,
      amount: "7512.40",
      categoryId: salaryCategory.id,
      date: dates.d1,
      isFixed: true,
    },
    {
      title: "Aluguel",
      type: TransactionType.EXPENSE,
      amount: "1200.00",
      categoryId: moradiaCategory.id,
      date: dates.d2,
      isFixed: true,
    },
    {
      title: "Mercado",
      type: TransactionType.EXPENSE,
      amount: "650.00",
      categoryId: alimentacaoCategory.id,
      date: dates.d3,
      isFixed: false,
    },
    {
      title: "Combustível / Transporte",
      type: TransactionType.EXPENSE,
      amount: "300.00",
      categoryId: transporteCategory.id,
      date: dates.d4,
      isFixed: false,
    },
    {
      title: "Lazer fim de semana",
      type: TransactionType.EXPENSE,
      amount: "220.00",
      categoryId: lazerCategory.id,
      date: dates.d5,
      isFixed: false,
    },
  ];

  for (const transaction of transactionsData) {
    const exists = await prisma.transaction.findFirst({
      where: {
        userId: user.id,
        title: transaction.title,
        date: transaction.date,
        amount: transaction.amount,
      },
    });

    if (!exists) {
      await prisma.transaction.create({
        data: {
          userId: user.id,
          categoryId: transaction.categoryId,
          title: transaction.title,
          type: transaction.type,
          amount: transaction.amount,
          date: transaction.date,
          isFixed: transaction.isFixed,
          isPaid: true,
        },
      });
    }
  }

  const contributionsData = [
    {
      title: "Aporte Tesouro Selic",
      institution: "Tesouro Direto",
      assetType: "Renda Fixa",
      amount: "500.00",
      date: new Date(year, month, 12),
      notes: "Aporte mensal",
    },
    {
      title: "Reserva de emergência",
      institution: "Nubank",
      assetType: "Reserva",
      amount: "350.00",
      date: new Date(year, month, 18),
      notes: "Reserva do mês",
    },
  ];

  for (const contribution of contributionsData) {
    const exists = await prisma.investmentContribution.findFirst({
      where: {
        userId: user.id,
        title: contribution.title,
        date: contribution.date,
        amount: contribution.amount,
      },
    });

    if (!exists) {
      await prisma.investmentContribution.create({
        data: {
          userId: user.id,
          title: contribution.title,
          institution: contribution.institution,
          assetType: contribution.assetType,
          amount: contribution.amount,
          date: contribution.date,
          notes: contribution.notes,
        },
      });
    }
  }

  console.log("Seed executado com sucesso.");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });