import { CategoriesList } from "@/components/dashboard/categories-list";
import { CategoriesSummary } from "@/components/dashboard/categories-summary";
import { CategoryForm } from "@/components/forms/category-form";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { getCategoriesPageData } from "@/lib/categories";

export default async function CategoriasPage() {
    const data = await getCategoriesPageData();

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="flex min-h-screen">
                <Sidebar />

                <div className="flex min-w-0 flex-1 flex-col">
                    <Header userName={data.user.name} />

                    <main className="flex-1 p-6 lg:p-8">
                        <div className="mx-auto max-w-[1600px] space-y-6">
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                    Categorias
                                </h1>
                                <p className="mt-1 text-sm text-slate-500">
                                    Cadastre e organize as categorias do sistema.
                                </p>
                            </div>

                            <CategoriesSummary
                                total={data.summary.total}
                                income={data.summary.income}
                                expense={data.summary.expense}
                                investment={data.summary.investment}
                            />

                            <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
                                <div>
                                    <CategoryForm />
                                </div>

                                <div className="space-y-6">
                                    <CategoriesList
                                        title="Categorias de receita"
                                        emptyText="Nenhuma categoria de receita cadastrada."
                                        categories={data.grouped.incomeCategories.map((item) => ({
                                            id: item.id,
                                            name: item.name,
                                            type: item.type,
                                            color: item.color,
                                            icon: item.icon,
                                        }))}
                                    />

                                    <CategoriesList
                                        title="Categorias de despesa"
                                        emptyText="Nenhuma categoria de despesa cadastrada."
                                        categories={data.grouped.expenseCategories.map((item) => ({
                                            id: item.id,
                                            name: item.name,
                                            type: item.type,
                                            color: item.color,
                                            icon: item.icon,
                                        }))}
                                    />

                                    <CategoriesList
                                        title="Categorias de investimento"
                                        emptyText="Nenhuma categoria de investimento cadastrada."
                                        categories={data.grouped.investmentCategories.map((item) => ({
                                            id: item.id,
                                            name: item.name,
                                            type: item.type,
                                            color: item.color,
                                            icon: item.icon,
                                        }))}
                                    />
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}