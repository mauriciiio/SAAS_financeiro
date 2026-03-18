"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { checkExistingReferences } from "@/app/importar-csv/actions/check-existing";
import { importCsvTransactions } from "@/app/importar-csv/actions/import-transactions";

type Category = { id: string; name: string; type: "INCOME" | "EXPENSE" };

type ParsedRow = {
    referenceId: string;
    date: string; // YYYY-MM-DD
    description: string;
    rawAmount: number; // negative = expense, positive = income
    amount: number; // absolute value
    type: "INCOME" | "EXPENSE";
    categoryId: string;
    alreadyExists: boolean;
    selected: boolean;
};

type Step = "upload" | "reviewing" | "done";

type ImportResult = { imported: number; skipped: number };

// ───────────── CSV parsing ─────────────

function detectDelimiter(line: string): string {
    const counts = { ";": 0, ",": 0, "\t": 0 };
    for (const ch of line) {
        if (ch in counts) counts[ch as keyof typeof counts]++;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function splitLine(line: string, delimiter: string): string[] {
    const cols: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            inQuotes = !inQuotes;
        } else if (ch === delimiter && !inQuotes) {
            cols.push(cur.replace(/^"|"$/g, "").trim());
            cur = "";
        } else {
            cur += ch;
        }
    }
    cols.push(cur.replace(/^"|"$/g, "").trim());
    return cols;
}

function parseBRNumber(s: string): number {
    // Brazilian format: 1.234,56 → 1234.56 | also -1.234,56
    return parseFloat(s.replace(/\./g, "").replace(",", "."));
}

/** Converts DD/MM/YYYY → YYYY-MM-DD */
function parseBRDate(s: string): string {
    const clean = s.replace(/\s/g, "");
    const [day, month, year] = clean.split("/");
    return `${year}-${month?.padStart(2, "0")}-${day?.padStart(2, "0")}`;
}

type RawRow = { RELEASE_DATE: string; TRANSACTION_TYPE: string; REFERENCE_ID: string; TRANSACTION_NET_AMOUNT: string };

function parseCSVContent(content: string): RawRow[] {
    const lines = content
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

    if (lines.length < 2) return [];

    const delimiter = detectDelimiter(lines[0]);

    // Find the header row (contains RELEASE_DATE)
    const headerIdx = lines.findIndex((l) =>
        l.toUpperCase().includes("RELEASE_DATE")
    );
    if (headerIdx === -1) throw new Error("Linha de cabeçalho não encontrada. Verifique se o arquivo é o CSV exportado do banco.");

    const headers = splitLine(lines[headerIdx], delimiter).map((h) =>
        h.toUpperCase().replace(/[^A-Z_]/g, "")
    );

    return lines
        .slice(headerIdx + 1)
        .map((line) => {
            const cols = splitLine(line, delimiter);
            return Object.fromEntries(headers.map((h, i) => [h, cols[i] ?? ""])) as RawRow;
        })
        .filter((row) => row.REFERENCE_ID && row.RELEASE_DATE);
}

// ───────────── Category suggestion ─────────────

const keywordRules: { keywords: string[]; hints: string[] }[] = [
    { keywords: ["rendimentos", "rendimento"], hints: ["rendimentos", "rendimento", "renda"] },
    { keywords: ["pix recebido", "ted recebido", "transferência recebida", "transferencia recebida"], hints: ["transferência", "pix", "receita", "renda"] },
    { keywords: ["salário", "salario"], hints: ["salário", "salario", "renda"] },
    { keywords: ["uber", "cabify", "99pop", "99 ", "trip.uber", "trip help.uber"], hints: ["transporte", "mobilidade", "uber", "taxi"] },
    { keywords: ["mercado livre", "shopee", "amazon", "americanas", "magazine"], hints: ["compras", "e-commerce", "shopping"] },
    { keywords: ["ifood", "rappi", "burger king", "mcdonald", "restaurante", "lanche", "food ltda", "pizza"], hints: ["alimentação", "restaurante", "comida", "refeição"] },
    { keywords: ["mercado", "supermercado", "atacadão", "carrefour", "extra ", "varejo"], hints: ["mercado", "supermercado", "alimentação", "compras"] },
    { keywords: ["telefonica", "tim ", " vivo", "claro ", "telecom", "internet"], hints: ["telefone", "internet", "telecom", "serviços"] },
    { keywords: ["spotify", "netflix", "prime", "youtube", "streaming"], hints: ["streaming", "assinaturas", "entretenimento"] },
    { keywords: ["farmácia", "farmacia", "drogasil", "panvel", "droga"], hints: ["saúde", "farmácia", "saude"] },
    { keywords: ["artflora", "mp*art", "flores", "jardinagem"], hints: ["casa", "decoração", "jardinagem"] },
    { keywords: ["pix enviado", "ted enviado", "transferência enviada", "transferencia enviada"], hints: ["transferência", "pix", "envio"] },
];

function suggestCategoryId(description: string, type: "INCOME" | "EXPENSE", categories: Category[]): string {
    const desc = description.toLowerCase();
    const typed = categories.filter((c) => c.type === type);

    // Direct name match
    for (const cat of typed) {
        if (desc.includes(cat.name.toLowerCase())) return cat.id;
    }

    // Keyword rules
    for (const rule of keywordRules) {
        if (rule.keywords.some((kw) => desc.includes(kw))) {
            const match = typed.find((cat) =>
                rule.hints.some((h) => cat.name.toLowerCase().includes(h))
            );
            if (match) return match.id;
        }
    }

    return typed[0]?.id ?? "";
}

// ───────────── Component ─────────────

export function CsvImportWizard({ categories }: { categories: Category[] }) {
    const [step, setStep] = useState<Step>("upload");
    const [rows, setRows] = useState<ParsedRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ImportResult | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // ── Step 1: parse file ──
    async function handleFile(file: File) {
        setLoading(true);
        try {
            const content = await file.text();
            const rawRows = parseCSVContent(content);

            if (rawRows.length === 0) {
                toast.error("Nenhuma transação encontrada no arquivo.");
                return;
            }

            // Build parsed rows
            const parsed: ParsedRow[] = rawRows.map((row) => {
                const rawAmount = parseBRNumber(row.TRANSACTION_NET_AMOUNT);
                const type: "INCOME" | "EXPENSE" = rawAmount >= 0 ? "INCOME" : "EXPENSE";
                const amount = Math.abs(rawAmount);
                return {
                    referenceId: String(row.REFERENCE_ID).trim(),
                    date: parseBRDate(row.RELEASE_DATE),
                    description: row.TRANSACTION_TYPE?.trim() ?? "",
                    rawAmount,
                    amount,
                    type,
                    categoryId: suggestCategoryId(row.TRANSACTION_TYPE ?? "", type, categories),
                    alreadyExists: false,
                    selected: true,
                };
            });

            // Check which already exist
            const refIds = parsed.map((r) => r.referenceId);
            const existing = await checkExistingReferences(refIds);
            const existingSet = new Set(existing);

            const withStatus = parsed.map((r) => ({
                ...r,
                alreadyExists: existingSet.has(r.referenceId),
                selected: !existingSet.has(r.referenceId),
            }));

            setRows(withStatus);
            setStep("reviewing");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erro ao ler o arquivo.");
        } finally {
            setLoading(false);
        }
    }

    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }

    // ── Step 2: update row ──
    function toggleRow(idx: number) {
        setRows((prev) =>
            prev.map((r, i) => (i === idx ? { ...r, selected: !r.selected } : r))
        );
    }

    function updateCategory(idx: number, categoryId: string) {
        setRows((prev) =>
            prev.map((r, i) => (i === idx ? { ...r, categoryId } : r))
        );
    }

    function toggleAll(selected: boolean) {
        setRows((prev) => prev.map((r) => (r.alreadyExists ? r : { ...r, selected })));
    }

    // ── Step 2: import ──
    async function handleImport() {
        const toImport = rows.filter((r) => r.selected && !r.alreadyExists && r.categoryId);

        if (toImport.length === 0) {
            toast.error("Nenhum lançamento selecionado para importar.");
            return;
        }

        setLoading(true);
        try {
            const res = await importCsvTransactions(
                toImport.map((r) => ({
                    referenceId: r.referenceId,
                    title: r.description,
                    date: r.date,
                    amount: r.amount,
                    type: r.type,
                    categoryId: r.categoryId,
                }))
            );

            setResult({ imported: res.imported, skipped: res.skipped });
            setStep("done");
            toast.success(`${res.imported} lançamentos importados!`);
        } catch {
            toast.error("Erro ao importar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    // ── Step 1 UI ──
    if (step === "upload") {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Selecione o arquivo CSV
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Exporte o extrato do seu banco no formato CSV e selecione o arquivo abaixo.
                        O arquivo deve conter as colunas: <code className="rounded bg-slate-100 px-1 dark:bg-slate-700">RELEASE_DATE</code>,{" "}
                        <code className="rounded bg-slate-100 px-1 dark:bg-slate-700">TRANSACTION_TYPE</code>,{" "}
                        <code className="rounded bg-slate-100 px-1 dark:bg-slate-700">REFERENCE_ID</code>,{" "}
                        <code className="rounded bg-slate-100 px-1 dark:bg-slate-700">TRANSACTION_NET_AMOUNT</code>.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={loading}
                    className="flex w-full cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-8 py-12 text-slate-500 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700/30 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/20"
                >
                    <Upload size={36} className={loading ? "animate-bounce" : ""} />
                    <span className="text-sm font-medium">
                        {loading ? "Processando..." : "Clique para selecionar o arquivo CSV"}
                    </span>
                </button>

                <input
                    ref={fileRef}
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={onFileChange}
                />
            </div>
        );
    }

    // ── Step 3 UI ──
    if (step === "done" && result) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm dark:border-slate-700 dark:bg-slate-800 text-center">
                <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
                <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Importação concluída!
                </h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                    <strong className="text-emerald-600">{result.imported}</strong> lançamentos importados.{" "}
                    {result.skipped > 0 && (
                        <span><strong>{result.skipped}</strong> ignorados (já existiam ou erro).</span>
                    )}
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    <a
                        href="/lancamentos"
                        className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        Ver lançamentos
                    </a>
                    <button
                        onClick={() => { setRows([]); setResult(null); setStep("upload"); }}
                        className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        Importar outro arquivo
                    </button>
                </div>
            </div>
        );
    }

    // ── Step 2 UI ──
    const newRows = rows.filter((r) => !r.alreadyExists);
    const selectedCount = rows.filter((r) => r.selected && !r.alreadyExists).length;
    const existingCount = rows.filter((r) => r.alreadyExists).length;
    const allSelected = newRows.every((r) => r.selected);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            Revisar lançamentos
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {rows.length} linhas encontradas •{" "}
                            <span className="text-emerald-600 font-medium">{newRows.length} novos</span>
                            {existingCount > 0 && (
                                <span> • <span className="text-slate-400">{existingCount} já importados</span></span>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setRows([]); setStep("upload"); }}
                            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
                        >
                            ← Trocar arquivo
                        </button>
                        <button
                            onClick={handleImport}
                            disabled={loading || selectedCount === 0}
                            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                            {loading ? "Importando..." : `Importar ${selectedCount} lançamento${selectedCount !== 1 ? "s" : ""}`}
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50">
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={allSelected && newRows.length > 0}
                                        onChange={(e) => toggleAll(e.target.checked)}
                                        className="h-4 w-4 rounded accent-emerald-600"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">Data</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Descrição</th>
                                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">Valor</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Categoria</th>
                                <th className="px-4 py-3 text-center font-medium text-slate-600 dark:text-slate-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {rows.map((row, idx) => {
                                const typedCats = categories.filter((c) => c.type === row.type);
                                return (
                                    <tr
                                        key={row.referenceId}
                                        className={`transition-colors ${
                                            row.alreadyExists
                                                ? "opacity-40"
                                                : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
                                        }`}
                                    >
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={row.selected}
                                                disabled={row.alreadyExists}
                                                onChange={() => toggleRow(idx)}
                                                className="h-4 w-4 rounded accent-emerald-600 disabled:cursor-not-allowed"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                            {new Intl.DateTimeFormat("pt-BR").format(
                                                new Date(row.date + "T12:00:00")
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-900 dark:text-slate-100 max-w-[260px]">
                                            <span className="block truncate" title={row.description}>
                                                {row.description}
                                            </span>
                                        </td>
                                        <td className={`px-4 py-3 text-right font-semibold whitespace-nowrap ${
                                            row.type === "INCOME" ? "text-emerald-600" : "text-rose-600"
                                        }`}>
                                            {row.type === "INCOME" ? "+" : "-"} {formatCurrency(row.amount)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={row.categoryId}
                                                disabled={row.alreadyExists}
                                                onChange={(e) => updateCategory(idx, e.target.value)}
                                                className="w-full max-w-[180px] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none disabled:cursor-not-allowed dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                                            >
                                                {typedCats.length === 0 && (
                                                    <option value="">Sem categorias</option>
                                                )}
                                                {typedCats.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {row.alreadyExists ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                                                    <AlertCircle size={11} />
                                                    Já importado
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    <CheckCircle2 size={11} />
                                                    Novo
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
