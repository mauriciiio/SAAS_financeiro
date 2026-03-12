"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Wallet,
    TrendingUp,
    Tags,
    Settings,
    Landmark,
    BarChart3,
} from "lucide-react";

const items = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/lancamentos", label: "Lançamentos", icon: Wallet },
    { href: "/investimentos", label: "Investimentos", icon: TrendingUp },
    { href: "/categorias", label: "Categorias", icon: Tags },
    { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
    { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex md:w-72 md:flex-col bg-slate-950 text-slate-100">
            <div className="border-b border-slate-800 px-6 py-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                        <Landmark size={22} />
                    </div>

                    <div>
                        <h1 className="text-lg font-semibold tracking-tight">Finance App</h1>
                        <p className="text-sm text-slate-400">Controle financeiro pessoal</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-2 px-4 py-6">
                {items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={[
                                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                                active
                                    ? "bg-slate-800 text-white shadow-sm"
                                    : "text-slate-400 hover:bg-slate-900 hover:text-white",
                            ].join(" ")}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-slate-800 p-4">
                <div className="rounded-2xl bg-slate-900 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Status
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-200">
                        Projeto local
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                        Seus dados estão rodando apenas no seu computador.
                    </p>
                </div>
            </div>
        </aside>
    );
}
