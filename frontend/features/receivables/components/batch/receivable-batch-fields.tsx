"use client";

import type { ChangeEvent } from "react";

import type { CurrencyOption } from "@/features/currencies/types";
import type { ReceivableTypeOption } from "@/features/receivable-types/types";
import { FormField } from "@/shared/components/fields/form-field";
import { SelectField } from "@/shared/components/fields/select-field";

import type { CreateReceivablePayload } from "../../types";

type ReceivableBatchFieldsProps = {
  data: CreateReceivablePayload;
  itemKey: string;
  types: ReceivableTypeOption[];
  currencies: CurrencyOption[];
  inputClassName: string;
  onUpdate: (field: keyof CreateReceivablePayload, value: string) => void;
};

export function ReceivableBatchFields({
  data,
  itemKey,
  types,
  currencies,
  inputClassName,
  onUpdate,
}: ReceivableBatchFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField id={`assignorName-${itemKey}`} label="Nome do cedente">
        <input
          id={`assignorName-${itemKey}`}
          value={data.assignorName}
          onChange={(event) => onUpdate("assignorName", event.target.value)}
          className={inputClassName}
          required
        />
      </FormField>

      <FormField
        id={`assignorDocument-${itemKey}`}
        label="Documento do cedente"
      >
        <input
          id={`assignorDocument-${itemKey}`}
          value={data.assignorDocument}
          onChange={(event) => onUpdate("assignorDocument", event.target.value)}
          className={inputClassName}
          placeholder="CPF ou CNPJ"
          required
        />
      </FormField>

      <SelectField
        id={`receivableTypeId-${itemKey}`}
        label="Tipo de recebível"
        options={types.map((type) => ({
          value: type.id,
          label: type.name,
        }))}
        registration={{
          value: data.receivableTypeId,
          onChange: (event: ChangeEvent<HTMLSelectElement>) =>
            onUpdate("receivableTypeId", event.target.value),
        }}
      />

      <SelectField
        id={`currencyId-${itemKey}`}
        label="Moeda"
        options={currencies.map((currency) => ({
          value: currency.id,
          label: `${currency.isoCode} - ${currency.name}`,
        }))}
        registration={{
          value: data.currencyId,
          onChange: (event: ChangeEvent<HTMLSelectElement>) =>
            onUpdate("currencyId", event.target.value),
        }}
      />

      <FormField id={`faceValue-${itemKey}`} label="Valor nominal">
        <input
          id={`faceValue-${itemKey}`}
          value={data.faceValue}
          onChange={(event) => onUpdate("faceValue", event.target.value)}
          className={inputClassName}
          type="number"
          min="0.01"
          step="0.01"
          required
        />
      </FormField>

      <FormField id={`baseRate-${itemKey}`} label="Taxa base">
        <input
          id={`baseRate-${itemKey}`}
          value={data.baseRate}
          onChange={(event) => onUpdate("baseRate", event.target.value)}
          className={inputClassName}
          type="number"
          min="0"
          step="0.0001"
          required
        />
      </FormField>

      <FormField id={`operationDate-${itemKey}`} label="Data da operação">
        <input
          id={`operationDate-${itemKey}`}
          value={data.operationDate}
          onChange={(event) => onUpdate("operationDate", event.target.value)}
          className={inputClassName}
          type="date"
          required
        />
      </FormField>

      <FormField id={`dueDate-${itemKey}`} label="Data de vencimento">
        <input
          id={`dueDate-${itemKey}`}
          value={data.dueDate}
          onChange={(event) => onUpdate("dueDate", event.target.value)}
          className={inputClassName}
          type="date"
          required
        />
      </FormField>
    </div>
  );
}
