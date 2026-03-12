"use client";

import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type HeaderProps = {
    userName: string;
};

export function Header({ userName }: HeaderProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
            <div className="flex h-20 items-center justify-between px-6">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                        Finance App
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Controle financeiro pessoal
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                            title="Alternar tema"
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    )}

                    <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700">
                        <Bell size={18} />
                    </button>

                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{userName}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Usuário local</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
