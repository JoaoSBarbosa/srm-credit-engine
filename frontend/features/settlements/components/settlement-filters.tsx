"use client";

import { useEffect, useState } from "react";

import { Button } from "@/shared/components/button";
import { FormField } from "@/shared/components/fields/form-field";
import { SelectField } from "@/shared/components/fields/select-field";
import { TextInput } from "@/shared/components/inputs/text-input";

import { getCurrencies } from "@/features/currencies/services/currency.service";
import type { CurrencyResponse } from "@/features/currencies/types";

import { getReceivableTypes } from "@/features/receivable-types/services/receivable-type.service";
import type { ReceivableTypeOption } from "@/features/receivable-types/types";

import type { SettlementFilter } from "../types";

type Props = {
  initialValue?: SettlementFilter;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onSubmit: (filter: SettlementFilter) => void;
};

export function SettlementFilters({
  initialValue = {},
  pageSize,
  onPageSizeChange,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<SettlementFilter>(initialValue);

  const [receivableTypes, setReceivableTypes] = useState<
    ReceivableTypeOption[]
  >([]);

  const [currencies, setCurrencies] = useState<CurrencyResponse[]>([]);

  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [loadingReceivableTypes, setLoadingReceivableTypes] = useState(true);

  useEffect(() => {
    async function loadFiltersOptions() {
      try {
        setLoadingCurrencies(true);
        setLoadingReceivableTypes(true);

        const [currenciesResponse, receivableTypesResponse] = await Promise.all(
          [getCurrencies(), getReceivableTypes()],
        );

        setCurrencies(currenciesResponse.content);
        setReceivableTypes(receivableTypesResponse.content);
      } finally {
        setLoadingCurrencies(false);
        setLoadingReceivableTypes(false);
      }
    }

    void loadFiltersOptions();
  }, []);

  function updateField(field: keyof SettlementFilter, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value || undefined,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit(form);
  }

  function handleClear() {
    const emptyFilter: SettlementFilter = {};

    setForm(emptyFilter);
    onSubmit(emptyFilter);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <FormField id="assignorName" label="Cedente">
          <TextInput
            id="assignorName"
            value={form.assignorName ?? ""}
            onChange={(event) =>
              updateField("assignorName", event.target.value)
            }
            placeholder="Nome do cedente"
          />
        </FormField>

        <SelectField
          id="currencyIso"
          label="Moeda"
          value={form.currencyIso ?? ""}
          onChange={(event) => updateField("currencyIso", event.target.value)}
          loading={loadingCurrencies}
          disabled={loadingCurrencies}
          options={[
            {
              value: "",
              label: "Todas as moedas",
            },
            ...currencies.map((currency) => ({
              value: currency.isoCode,
              label: `${currency.isoCode} - ${currency.name}`,
            })),
          ]}
        />

        <SelectField
          id="receivableTypeCode"
          label="Tipo"
          value={form.receivableTypeCode ?? ""}
          onChange={(event) =>
            updateField("receivableTypeCode", event.target.value)
          }
          loading={loadingReceivableTypes}
          disabled={loadingReceivableTypes}
          options={[
            {
              value: "",
              label: "Todos os tipos",
            },
            ...receivableTypes.map((type) => ({
              value: type.code,
              label: `${type.code} - ${type.name}`,
            })),
          ]}
        />

        <FormField id="startDate" label="Data inicial">
          <TextInput
            id="startDate"
            type="date"
            value={form.startDate ?? ""}
            onChange={(event) => updateField("startDate", event.target.value)}
          />
        </FormField>

        <FormField id="endDate" label="Data final">
          <TextInput
            id="endDate"
            type="date"
            value={form.endDate ?? ""}
            onChange={(event) => updateField("endDate", event.target.value)}
          />
        </FormField>

        <SelectField
          id="pageSize"
          label="Itens por página"
          value={String(pageSize)}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          options={[
            {
              value: "5",
              label: "5 itens",
            },
            {
              value: "10",
              label: "10 itens",
            },
            {
              value: "20",
              label: "20 itens",
            },
            {
              value: "50",
              label: "50 itens",
            },
            {
              value: "100",
              label: "100 itens",
            },
          ]}
        />
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={handleClear}>
          Limpar filtros
        </Button>

        <Button type="submit">Filtrar</Button>
      </div>
    </form>
  );
}
