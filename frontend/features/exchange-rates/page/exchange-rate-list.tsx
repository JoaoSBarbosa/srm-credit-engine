"use client";

import { useEffect, useState } from "react";

import { Button } from "@/shared/components/button";

import { getCurrencies } from "@/features/currencies/services/currency.service";
import type { CurrencyResponse } from "@/features/currencies/types";

import { ExchangeRateForm } from "../components/exchange-rate-form";
import { ExchangeRateTable } from "../components/exchange-rate-table";
import { useExchangeRates } from "../hook/use-exchange-rates";
import { ExchangeRateResponse, CreateExchangeRateRequest, UpdateExchangeRateRequest } from "../type";

export function ExchangeRateList() {
  const {
    items,
    page,
    pageSize,
    totalPages,
    totalElements,
    loading,
    saving,
    create,
    update,
    sync,
    changePage,
    changePageSize,
  } = useExchangeRates();

  const [currencies, setCurrencies] = useState<CurrencyResponse[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);

  const [selectedExchangeRate, setSelectedExchangeRate] = useState<
    ExchangeRateResponse | undefined
  >();

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function loadCurrencies() {
      try {
        setLoadingCurrencies(true);

        const response = await getCurrencies();

        setCurrencies(response.content);
      } finally {
        setLoadingCurrencies(false);
      }
    }

    void loadCurrencies();
  }, []);

  async function handleSubmit(
    payload: CreateExchangeRateRequest | UpdateExchangeRateRequest,
  ) {
    if (selectedExchangeRate) {
      const success = await update(selectedExchangeRate.id, payload);

      if (success) {
        setSelectedExchangeRate(undefined);
        setShowForm(false);
      }

      return;
    }

    const success = await create(payload as CreateExchangeRateRequest);

    if (success) {
      setShowForm(false);
    }
  }

  function handleEdit(exchangeRate: ExchangeRateResponse) {
    setSelectedExchangeRate(exchangeRate);
    setShowForm(true);
  }

  async function handleSync(exchangeRate: ExchangeRateResponse) {
    const sourceCurrency = currencies.find(
      (currency) => currency.isoCode === exchangeRate.sourceCurrency,
    );

    const targetCurrency = currencies.find(
      (currency) => currency.isoCode === exchangeRate.targetCurrency,
    );

    if (!sourceCurrency || !targetCurrency) {
      return;
    }

    await sync(sourceCurrency.id, targetCurrency.id);
  }

  function handleNew() {
    setSelectedExchangeRate(undefined);
    setShowForm(true);
  }

  function handleCancel() {
    setSelectedExchangeRate(undefined);
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Taxas de câmbio</h1>

          <p className="mt-1 text-sm text-slate-400">
            Gerencie as taxas utilizadas nas operações de precificação.
          </p>
        </div>

        {!showForm && (
          <Button type="button" onClick={handleNew}>
            Nova taxa
          </Button>
        )}
      </div>

      {showForm && (
        <section className="rounded-xl border border-white/10 bg-slate-900/50 p-5">
          <h2 className="mb-5 text-base font-semibold text-white">
            {selectedExchangeRate
              ? "Editar taxa de câmbio"
              : "Nova taxa de câmbio"}
          </h2>

          <ExchangeRateForm
            initialValue={selectedExchangeRate}
            currencies={currencies}
            loadingCurrencies={loadingCurrencies}
            loading={saving}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </section>
      )}

      <section className="rounded-xl border border-white/10 bg-slate-900/50">
        <ExchangeRateTable
          items={items}
          loading={loading}
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={changePage}
          onEdit={handleEdit}
          onSync={handleSync}
        />
      </section>

      <div className="flex justify-end">
        <label className="flex items-center gap-2 text-sm text-slate-400">
          Itens por página
          <select
            value={pageSize}
            onChange={(event) => changePageSize(Number(event.target.value))}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus:border-slate-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </label>
      </div>
    </div>
  );
}
