"use client";

import { CurrencyFormModal } from "@/features/currencies/components/currency-form-modal";
import { CurrencyList } from "@/features/currencies/components/currency-list";
import { useCurrencies } from "../hook/use-currencies";

export default function CurrenciesPage() {
  const {
    items,
    loading,
    saving,
    modalOpen,
    editingCurrency,
    openCreateModal,
    openEditModal,
    closeModal,
    save,
  } = useCurrencies();

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Moedas</h1>

          <p className="mt-1 text-sm text-slate-400">
            Gerencie as moedas utilizadas nas operações.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
        >
          Nova moeda
        </button>
      </div>

      <CurrencyList items={items} loading={loading} onEdit={openEditModal} />

      <CurrencyFormModal
        open={modalOpen}
        currency={editingCurrency}
        loading={saving}
        onClose={closeModal}
        onSubmit={save}
      />
    </main>
  );
}
