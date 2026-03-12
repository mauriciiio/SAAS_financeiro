import { InvestmentsList } from "@/components/dashboard/investments-list";
import { InvestmentsSummary } from "@/components/dashboard/investments-summary";
import { InvestmentForm } from "@/components/forms/investment-form";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { getInvestmentsPageData } from "@/lib/investments";

export default async function InvestimentosPage() {
    const data = await getInvestmentsPageData();

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
                                    Investimentos
                                </h1>
                                <p className="mt-1 text-sm text-slate-500">
                                    Cadastre e acompanhe seus aportes.
                                </p>
                            </div>

                            <InvestmentsSummary
                                totalInvested={data.summary.totalInvested}
                                totalCount={data.summary.totalCount}
                            />

                            <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
                                <div>
                                    <InvestmentForm />
                                </div>

                                <div>
                                    <InvestmentsList
                                        investments={data.investments.map((item) => ({
                                            id: item.id,
                                            title: item.title,
                                            institution: item.institution,
                                            assetType: item.assetType,
                                            amount: Number(item.amount),
                                            date: item.date,
                                            notes: item.notes,
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