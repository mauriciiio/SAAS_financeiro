"use client";

import { Download } from "lucide-react";

type CsvRow = {
    data: string;
    tipo: string;
    titulo: string;
    categoria: string;
    valor: number;
    descricao: string;
};

type ReportsCsvButtonProps = {
    rows: CsvRow[];
    filename?: string;
};

export function ReportsCsvButton({ rows, filename = "relatorio" }: ReportsCsvButtonProps) {
    function handleExport() {
        const headers = ["Data", "Tipo", "Título", "Categoria", "Valor", "Descrição"];
        const lines = [
            headers.join(";"),
            ...rows.map((r) =>
                [
                    r.data,
                    r.tipo,
                    `"${r.titulo}"`,
                    `"${r.categoria}"`,
                    r.valor.toFixed(2).replace(".", ","),
                    `"${r.descricao}"`,
                ].join(";")
            ),
        ];

        const blob = new Blob(["\uFEFF" + lines.join("\n")], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    }

    return (
        <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
            <Download size={16} />
            Exportar CSV
        </button>
    );
}
