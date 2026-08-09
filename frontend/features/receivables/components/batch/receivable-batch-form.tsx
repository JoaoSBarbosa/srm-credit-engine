"use client";

import type { ReceivableTypeOption } from "@/features/receivable-types/types";

import type { BatchReceivableItem, CreateReceivablePayload } from "../../types";
import { ReceivableBatchSimulation } from "./receivable-batch-simulation";
import { ReceivableBatchSummary } from "./receivable-batch-summary";
import { ReceivableBatchFields } from "./receivable-batch-fields";
import { CurrencyResponse } from "@/features/currencies/types";

type ReceivableBatchFormProps = {
  item: BatchReceivableItem;
  types: ReceivableTypeOption[];
  currencies: CurrencyResponse[];
  inputClassName: string;
  selected: boolean;
  onToggleSelected: () => void;
  onToggleExpanded: () => void;
  onRemove: () => void;
  onUpdate: (field: keyof CreateReceivablePayload, value: string) => void;
};

export function ReceivableBatchForm({
  item,
  types,
  currencies,
  inputClassName,
  selected,
  onToggleSelected,
  onToggleExpanded,
  onRemove,
  onUpdate,
}: ReceivableBatchFormProps) {
  if (!item.expanded) {
    return (
      <ReceivableBatchSummary
        item={item}
        selected={selected}
        onToggleSelected={onToggleSelected}
        onToggleExpanded={onToggleExpanded}
        onRemove={onRemove}
      />
    );
  }

  return (
    <article className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelected}
            className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900"
            aria-label="Selecionar recebível"
          />

          <div>
            <h3 className="text-sm font-semibold text-white">Novo recebível</h3>

            <p className="mt-1 text-xs text-slate-500">
              Informe os dados da operação.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleExpanded}
          className="shrink-0 text-xs font-medium text-slate-400 transition hover:text-white"
        >
          Ocultar
        </button>
      </div>

      <ReceivableBatchFields
        data={item.data}
        itemKey={item.key}
        types={types}
        currencies={currencies}
        inputClassName={inputClassName}
        onUpdate={onUpdate}
      />

      <ReceivableBatchSimulation receivable={item.data} />

      <div className="mt-5 flex justify-end border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-medium text-red-400 transition hover:text-red-300"
        >
          Remover recebível
        </button>
      </div>
    </article>
  );
}
