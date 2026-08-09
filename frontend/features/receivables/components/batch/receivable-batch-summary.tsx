"use client";

import type { BatchReceivableItem } from "../../types";

type ReceivableBatchSummaryProps = {
  item: BatchReceivableItem;
  selected: boolean;
  onToggleSelected: () => void;
  onToggleExpanded: () => void;
  onRemove: () => void;
};

export function ReceivableBatchSummary({
  item,
  selected,
  onToggleSelected,
  onToggleExpanded,
  onRemove,
}: ReceivableBatchSummaryProps) {
  const { data } = item;

  return (
    <article className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelected}
          className="h-4 w-4 rounded border-slate-600 bg-slate-900"
          aria-label="Selecionar recebível"
        />

        <button
          type="button"
          onClick={onToggleExpanded}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="truncate text-sm font-semibold text-white">
              {data.assignorName || "Novo recebível"}
            </span>

            <span className="text-xs text-slate-500">Recebível</span>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">
            <span>
              {data.faceValue
                ? `Valor: ${data.faceValue}`
                : "Valor não informado"}
            </span>

            <span>
              {data.dueDate
                ? `Vencimento: ${data.dueDate}`
                : "Vencimento não informado"}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 text-xs font-medium text-red-400 transition hover:text-red-300"
        >
          Remover
        </button>
      </div>
    </article>
  );
}
