"use client";

import { useCreateReceivableBatch } from "../../hooks/use-create-receivable-batch-form";
import { BatchFeedback } from "./batch-feedback";
import { ReceivableBatchList } from "./receivable-batch-list";

const inputClassName =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500";

export function CreateBatchReceivableForm() {
  const {
    items,
    types,
    currencies,
    selectedKeys,
    loading,
    message,
    error,
    updateReceivable,
    addReceivable,
    toggleExpanded,
    removeReceivable,
    toggleSelected,
    toggleSelectAll,
    removeSelected,
    handleSubmit,
  } = useCreateReceivableBatch();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ReceivableBatchList
        items={items}
        types={types}
        currencies={currencies}
        selectedKeys={selectedKeys}
        inputClassName={inputClassName}
        onUpdate={updateReceivable}
        onAdd={addReceivable}
        onRemove={removeReceivable}
        onToggleExpanded={toggleExpanded}
        onToggleSelected={toggleSelected}
        onToggleSelectAll={toggleSelectAll}
        onRemoveSelected={removeSelected}
      />

      <BatchFeedback message={message} error={error} />

      <div className="flex justify-end border-t border-white/10 pt-5">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {loading ? "Cadastrando lote..." : `Cadastrar lote (${items.length})`}
        </button>
      </div>
    </form>
  );
}
