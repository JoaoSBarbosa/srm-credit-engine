"use client";

import { useState } from "react";

import { Button } from "@/shared/components/button";
import { FormField } from "@/shared/components/fields/form-field";
import { SelectField } from "@/shared/components/fields/select-field";
import { TextInput } from "@/shared/components/inputs/text-input";

import type { CurrencyResponse } from "@/features/currencies/types";

import type {
  CreateExchangeRateRequest,
  ExchangeRateResponse,
  UpdateExchangeRateRequest,
} from "../type";

type ExchangeRateFormProps = {
  initialValue?: ExchangeRateResponse;
  currencies: CurrencyResponse[];
  loadingCurrencies: boolean;
  loading?: boolean;
  onSubmit: (
    payload: CreateExchangeRateRequest | UpdateExchangeRateRequest,
  ) => void;
  onCancel: () => void;
};

const RATE_DECIMAL_PLACES = 6;
const MAX_RATE_DIGITS = 15;

function formatRateFromDigits(digits: string): string {
  if (!digits) {
    return "";
  }

  const padded = digits.padStart(RATE_DECIMAL_PLACES + 1, "0");
  const integerPart = padded
    .slice(0, -RATE_DECIMAL_PLACES)
    .replace(/^0+(?=\d)/, "");
  const decimalPart = padded.slice(-RATE_DECIMAL_PLACES);

  const integerFormatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${integerFormatted},${decimalPart}`;
}

function digitsFromRateNumber(value: number): string {
  const digits = Math.round(value * 10 ** RATE_DECIMAL_PLACES).toString();
  return digits === "0" ? "" : digits;
}

export function ExchangeRateForm({
  initialValue,
  currencies,
  loadingCurrencies,
  loading = false,
  onSubmit,
  onCancel,
}: ExchangeRateFormProps) {
  const [sourceCurrencyId, setSourceCurrencyId] = useState("");
  const [targetCurrencyId, setTargetCurrencyId] = useState("");
  const [rateDigits, setRateDigits] = useState("");
  const [referenceDate, setReferenceDate] = useState("");

  const syncKey = initialValue
    ? `${initialValue.sourceCurrency}-${initialValue.targetCurrency}-${initialValue.referenceDate}-${initialValue.exchangeRate}`
    : "create";

  const [lastSyncKey, setLastSyncKey] = useState<string | null>(null);

  const currenciesReady = !initialValue || currencies.length > 0;

  if (syncKey !== lastSyncKey && currenciesReady) {
    setLastSyncKey(syncKey);

    if (!initialValue) {
      setSourceCurrencyId("");
      setTargetCurrencyId("");
      setRateDigits("");
      setReferenceDate("");
    } else {
      const sourceCurrency = currencies.find(
        (currency) => currency.isoCode === initialValue.sourceCurrency,
      );

      const targetCurrency = currencies.find(
        (currency) => currency.isoCode === initialValue.targetCurrency,
      );

      setSourceCurrencyId(sourceCurrency?.id ?? "");
      setTargetCurrencyId(targetCurrency?.id ?? "");
      setRateDigits(digitsFromRateNumber(initialValue.exchangeRate));
      setReferenceDate(initialValue.referenceDate);
    }
  }

  function handleExchangeRateChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const digits = event.target.value
      .replace(/\D/g, "")
      .replace(/^0+(?=\d)/, "")
      .slice(0, MAX_RATE_DIGITS);

    setRateDigits(digits);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const exchangeRate = rateDigits
      ? Number(rateDigits) / 10 ** RATE_DECIMAL_PLACES
      : 0;

    const payload = {
      sourceCurrencyId,
      targetCurrencyId,
      exchangeRate,
      referenceDate,
    };

    onSubmit(payload);
  }

  const currencyOptions = currencies.map((currency) => ({
    value: currency.id,
    label: `${currency.isoCode} - ${currency.name}`,
  }));

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          id="sourceCurrencyId"
          label="Moeda de origem"
          value={sourceCurrencyId}
          onChange={(event) => setSourceCurrencyId(event.target.value)}
          loading={loadingCurrencies}
          disabled={loading || loadingCurrencies}
          options={currencyOptions}
        />

        <SelectField
          id="targetCurrencyId"
          label="Moeda de destino"
          value={targetCurrencyId}
          onChange={(event) => setTargetCurrencyId(event.target.value)}
          loading={loadingCurrencies}
          disabled={loading || loadingCurrencies}
          options={currencyOptions}
        />

        <FormField id="exchangeRate" label="Taxa de câmbio">
          <TextInput
            id="exchangeRate"
            type="text"
            inputMode="numeric"
            value={formatRateFromDigits(rateDigits)}
            onChange={handleExchangeRateChange}
            placeholder="0,000000"
            disabled={loading}
            required
          />
        </FormField>

        <FormField id="referenceDate" label="Data de referência">
          <TextInput
            id="referenceDate"
            type="date"
            value={referenceDate}
            onChange={(event) => setReferenceDate(event.target.value)}
            disabled={loading}
            required
          />
        </FormField>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          loading={loading}
          loadingText="Salvando..."
          disabled={loadingCurrencies}
        >
          {initialValue ? "Atualizar taxa" : "Cadastrar taxa"}
        </Button>
      </div>
    </form>
  );
}
