"use client";
import type { ReceivableTypeOption } from "@/features/receivable-types/types";
import type { BatchReceivableItem, CreateReceivablePayload } from "../../types";
import { ReceivableBatchForm } from "./receivable-batch-form";
import { CurrencyResponse } from "@/features/currencies/types";

type Props = {
  items: BatchReceivableItem[];
  types: ReceivableTypeOption[];
  currencies: CurrencyResponse[];
  selectedKeys: string[];
  inputClassName: string;
  onUpdate: (
    key: string,
    field: keyof CreateReceivablePayload,
    value: string,
  ) => void;
  onAdd: () => void;
  onRemove: (key: string) => void;
  onToggleExpanded: (key: string) => void;
  onToggleSelected: (key: string) => void;
  onToggleSelectAll: () => void;
  onRemoveSelected: () => void;
};

export function ReceivableBatchList({
  items,
  types,
  currencies,
  selectedKeys,
  inputClassName,
  onUpdate,
  onAdd,
  onRemove,
  onToggleExpanded,
  onToggleSelected,
  onToggleSelectAll,
  onRemoveSelected,
}: Props) {
  const allSelected = items.length > 0 && selectedKeys.length === items.length;

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Recebíveis</h2>

          <p className="mt-1 text-sm text-slate-400">
            Cadastre os recebíveis que farão parte do lote.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedKeys.length > 0 && (
            <button
              type="button"
              onClick={onRemoveSelected}
              className="rounded-lg border border-red-500/30 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
            >
              Remover selecionados ({selectedKeys.length})
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={onToggleSelectAll}
          className="h-4 w-4 rounded border-slate-700 bg-slate-950"
        />

        <span className="text-xs text-slate-400">
          {selectedKeys.length > 0
            ? `${selectedKeys.length} selecionado(s)`
            : "Selecionar todos"}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <ReceivableBatchForm
            key={item.key}
            item={item}
            types={types}
            currencies={currencies}
            inputClassName={inputClassName}
            selected={selectedKeys.includes(item.key)}
            onToggleSelected={() => onToggleSelected(item.key)}
            onToggleExpanded={() => onToggleExpanded(item.key)}
            onRemove={() => onRemove(item.key)}
            onUpdate={(field, value) => onUpdate(item.key, field, value)}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-slate-500">
          {items.length} {items.length === 1 ? "recebível" : "recebíveis"} no
          lote
        </span>

        <button
          type="button"
          onClick={onAdd}
          className="w-full rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800 sm:w-auto"
        >
          + Adicionar nova linha
        </button>
      </div>
    </section>
  );
}
