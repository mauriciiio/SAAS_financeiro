import { Bell, Search } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="flex h-20 items-center justify-between px-6">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Dashboard
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Acompanhe receitas, despesas, investimentos e saldo do mês.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 lg:flex">
                        <Search size={16} className="text-slate-400" />
                        <span className="text-sm text-slate-400">Buscar</span>
                    </div>

                    <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50">
                        <Bell size={18} />
                    </button>

                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                            M
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-medium text-slate-900">Maurício</p>
                            <p className="text-xs text-slate-500">Usuário local</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}