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

function getAlignment(align: DataTableColumn<unknown>["align"]): string {
  return ALIGN_CLASSES[align ?? "left"];
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  emptyMessage = "Nenhum registro encontrado.",
  pagination,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/50">
      {/* Desktop */}
      <div className="hidden w-full md:block">
        <div className="max-h-[500px] w-full overflow-y-auto overflow-x-hidden">
          <table className="w-full table-fixed">
            <thead className="sticky top-0 z-10 bg-slate-900">
              <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 font-medium lg:px-5 ${getAlignment(
                      column.align,
                    )}`}
                  >
                    <span className="block truncate">{column.header}</span>
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
                        className={`max-w-0 overflow-hidden px-4 py-3.5 lg:px-5 ${getAlignment(
                          column.align,
                        )}`}
                      >
                        <div className="break-words">{column.render(row)}</div>
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="divide-y divide-white/10 md:hidden">
        {loading && (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Carregando...
          </div>
        )}

        {!loading && rows.length === 0 && (
          <div className="px-5 py-6">
            <EmptyState message={emptyMessage} />
          </div>
        )}

        {!loading &&
          rows.map((row) => (
            <article
              key={rowKey(row)}
              className="space-y-3 p-4 transition hover:bg-white/[0.03]"
            >
              {columns.map((column) => (
                <div
                  key={column.key}
                  className="flex items-start justify-between gap-4"
                >
                  <span className="shrink-0 text-xs font-medium text-slate-500">
                    {column.header}
                  </span>

                  <div
                    className={`min-w-0 break-words text-sm text-slate-200 ${getAlignment(
                      column.align,
                    )}`}
                  >
                    {column.render(row)}
                  </div>
                </div>
              ))}
            </article>
          ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-3.5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-5">
          <span>
            Página {pagination.page + 1} de {pagination.totalPages} ·{" "}
            {pagination.totalElements} registro(s)
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.page <= 0}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="flex-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
            >
              Anterior
            </button>

            <button
              type="button"
              disabled={pagination.page + 1 >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="flex-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
