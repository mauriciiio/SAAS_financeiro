import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { CsvImportWizard } from "@/components/csv/csv-import-wizard";
import { prisma } from "@/lib/prisma";
import { CategoryType } from "@prisma/client";

async function getPageData() {
    const user = await prisma.user.findFirstOrThrow({
        where: { email: "local@financeapp.dev" },
    });

    const categories = await prisma.category.findMany({
        where: {
            userId: user.id,
            type: { in: [CategoryType.INCOME, CategoryType.EXPENSE] },
        },
        orderBy: { name: "asc" },
    });

    return { user, categories };
}

export default async function ImportarCsvPage() {
    const { user, categories } = await getPageData();

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
            <div className="flex min-h-screen">
                <Sidebar />

                <div className="flex min-w-0 flex-1 flex-col">
                    <Header userName={user.name} />

                    <main className="flex-1 p-6 lg:p-8">
                        <div className="mx-auto max-w-[1200px] space-y-6">
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                    Importar CSV
                                </h1>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Importe lançamentos a partir do extrato CSV exportado pelo seu banco.
                                    Lançamentos duplicados (mesmo <code className="rounded bg-slate-200 px-1 dark:bg-slate-700">REFERENCE_ID</code>) são ignorados automaticamente.
                                </p>
                            </div>

                            <CsvImportWizard
                                categories={categories.map((c) => ({
                                    id: c.id,
                                    name: c.name,
                                    type: c.type as "INCOME" | "EXPENSE",
                                }))}
                            />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
