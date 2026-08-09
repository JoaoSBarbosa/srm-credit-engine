type PaginationProps = {
  page: number;
  totalPages: number;
  totalElements?: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

export function Pagination({
  page,
  totalPages,
  totalElements,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 0) {
    return null;
  }

  const isFirstPage = page <= 0;
  const isLastPage = page >= totalPages - 1;

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-sm text-slate-400 sm:flex-row">
      <span>
        Página {page + 1} de {totalPages}
        {typeof totalElements === "number"
          ? ` · ${totalElements} registro(s)`
          : ""}
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled || isFirstPage}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>

        <button
          type="button"
          disabled={disabled || isLastPage}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
