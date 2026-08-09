import type { ReactNode } from "react";
import { EmptyState } from "../empty";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  render: (row: T) => ReactNode;
};

export type DataTablePagination = {
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  pagination?: DataTablePagination;
};

const ALIGN_CLASSES: Record<
  NonNullable<DataTableColumn<unknown>["align"]>,
  string
> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  emptyMessage = "Nenhum registro encontrado.",
  pagination,
}: DataTableProps<T>) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/20">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-5 py-3 font-medium ${
                    ALIGN_CLASSES[column.align ?? "left"]
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {loading && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-10 text-center text-slate-500"
                >
                  Carregando...
                </td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-6">
                  <EmptyState message={emptyMessage} />
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="text-slate-200 transition hover:bg-white/5"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-5 py-3.5 ${
                        ALIGN_CLASSES[column.align ?? "left"]
                      }`}
                    >
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col gap-2 border-t border-white/10 px-5 py-3.5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Página {pagination.page + 1} de {pagination.totalPages} ·{" "}
            {pagination.totalElements} registro(s)
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.page <= 0}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>

            <button
              type="button"
              disabled={pagination.page + 1 >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
