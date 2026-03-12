import { EditCategoryDialog } from "@/components/forms/edit-category-dialog";
import { DeleteCategoryForm } from "@/components/forms/delete-category-form";

type CategoryItem = {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE" | "INVESTMENT";
    color: string | null;
    icon: string | null;
};

type CategoriesListProps = {
    title: string;
    emptyText: string;
    categories: CategoryItem[];
};

function getTypeBadge(type: CategoryItem["type"]) {
    switch (type) {
        case "INCOME":
            return "bg-emerald-100 text-emerald-700";
        case "EXPENSE":
            return "bg-rose-100 text-rose-700";
        case "INVESTMENT":
            return "bg-blue-100 text-blue-700";
        default:
            return "bg-slate-100 text-slate-700";
    }
}

function getTypeLabel(type: CategoryItem["type"]) {
    switch (type) {
        case "INCOME":
            return "Receita";
        case "EXPENSE":
            return "Despesa";
        case "INVESTMENT":
            return "Investimento";
        default:
            return type;
    }
}

export function CategoriesList({
    title,
    emptyText,
    categories,
}: CategoriesListProps) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            </div>

            <div className="space-y-3">
                {categories.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                        {emptyText}
                    </div>
                ) : (
                    categories.map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="truncate text-sm font-semibold text-slate-900">
                                        {category.name}
                                    </p>

                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${getTypeBadge(
                                            category.type
                                        )}`}
                                    >
                                        {getTypeLabel(category.type)}
                                    </span>
                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                    Cor: {category.color || "não definida"} • Ícone:{" "}
                                    {category.icon || "não definido"}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <EditCategoryDialog
                                    category={{
                                        id: category.id,
                                        name: category.name,
                                        type: category.type,
                                        color: category.color,
                                        icon: category.icon,
                                    }}
                                />
                                <DeleteCategoryForm id={category.id} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}