"use client";
import { useState } from "react";
import type { CurrencyRequest, CurrencyResponse } from "../types";

type Props = {
  open: boolean;
  currency: CurrencyResponse | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: CurrencyRequest) => void;
};

const EMPTY_FORM: CurrencyRequest = {
  isoCode: "",
  name: "",
};

export function CurrencyFormModal({
  open,
  currency,
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CurrencyRequest>(EMPTY_FORM);

  const [syncedWith, setSyncedWith] = useState<{
    open: boolean;
    currencyId: string | null;
  }>({ open: false, currencyId: null });

  const currencyId = currency?.id ?? null;
  const needsResync =
    open && (open !== syncedWith.open || currencyId !== syncedWith.currencyId);

  if (needsResync) {
    setSyncedWith({ open, currencyId });
    setForm(
      currency
        ? { isoCode: currency.isoCode, name: currency.name }
        : EMPTY_FORM,
    );
  } else if (!open && syncedWith.open) {
    setSyncedWith({ open: false, currencyId });
  }

  if (!open) {
    return null;
  }

  const editing = currency !== null;

  function updateField(field: keyof CurrencyRequest, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      isoCode: form.isoCode.trim().toUpperCase(),
      name: form.name.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-900 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-white">
              {editing ? "Editar moeda" : "Nova moeda"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {editing
                ? "Atualize os dados da moeda."
                : "Cadastre uma nova moeda."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 transition hover:text-white disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label
              htmlFor="currency-iso-code"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Código ISO
            </label>

            <input
              id="currency-iso-code"
              value={form.isoCode}
              onChange={(event) => updateField("isoCode", event.target.value)}
              maxLength={3}
              placeholder="BRL"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-slate-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="currency-name"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Nome
            </label>

            <input
              id="currency-name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Real Brasileiro"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-slate-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Salvando..."
                : editing
                  ? "Salvar alterações"
                  : "Cadastrar moeda"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
