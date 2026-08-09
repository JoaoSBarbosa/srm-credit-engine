import type { ReceivableTypeOption } from "@/features/receivable-types/types";
import { FormField } from "@/shared/components/fields/form-field";
import { SelectField } from "@/shared/components/fields/select-field";
import { MaskedInput } from "@/shared/components/inputs/masked-input";

import type { CreateReceivablePayload } from "../types";
import { CurrencyResponse } from "@/features/currencies/types";

type ReceivableFormFieldsProps = {
  form: CreateReceivablePayload;
  types: ReceivableTypeOption[];
  currencies: CurrencyResponse[];
  inputClassName: string;
  updateField: (field: keyof CreateReceivablePayload, value: string) => void;
};

export function ReceivableFormFields({
  form,
  types,
  currencies,
  inputClassName,
  updateField,
}: ReceivableFormFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField id="assignorName" label="Nome do cedente">
        <input
          id="assignorName"
          value={form.assignorName}
          onChange={(event) => updateField("assignorName", event.target.value)}
          className={inputClassName}
          required
        />
      </FormField>

      <FormField id="assignorDocument" label="Documento do cedente">
        <MaskedInput
          id="assignorDocument"
          value={form.assignorDocument}
          onChange={(value) => updateField("assignorDocument", value)}
          className={inputClassName}
          placeholder="CPF ou CNPJ"
          required
          format={(value) => {
            const digits = value.replace(/\D/g, "");

            if (digits.length <= 11) {
              return digits
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
                .slice(0, 14);
            }

            return digits
              .replace(/(\d{2})(\d)/, "$1.$2")
              .replace(/(\d{3})(\d)/, "$1.$2")
              .replace(/(\d{3})(\d{1,2})$/, "$1/$2")
              .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
              .slice(0, 18);
          }}
        />
      </FormField>

      <SelectField
        id="receivableTypeId"
        label="Tipo de recebível"
        options={types.map((type) => ({
          value: type.id,
          label: type.name,
        }))}
        registration={{
          value: form.receivableTypeId,
          onChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
            updateField("receivableTypeId", event.target.value),
        }}
      />

      <SelectField
        id="currencyId"
        label="Moeda"
        options={currencies.map((currency) => ({
          value: currency.id,
          label: `${currency.isoCode} - ${currency.name}`,
        }))}
        registration={{
          value: form.currencyId,
          onChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
            updateField("currencyId", event.target.value),
        }}
      />

      <FormField id="faceValue" label="Valor nominal">
        <input
          id="faceValue"
          value={form.faceValue}
          onChange={(event) => updateField("faceValue", event.target.value)}
          className={inputClassName}
          type="number"
          min="0.01"
          step="0.01"
          required
        />
      </FormField>

      <FormField id="baseRate" label="Taxa base">
        <input
          id="baseRate"
          value={form.baseRate}
          onChange={(event) => updateField("baseRate", event.target.value)}
          className={inputClassName}
          type="number"
          step="0.0001"
          required
        />
      </FormField>

      <FormField id="operationDate" label="Data da operação">
        <input
          id="operationDate"
          value={form.operationDate}
          onChange={(event) => updateField("operationDate", event.target.value)}
          className={inputClassName}
          type="date"
          required
        />
      </FormField>

      <FormField id="dueDate" label="Data de vencimento">
        <input
          id="dueDate"
          value={form.dueDate}
          onChange={(event) => updateField("dueDate", event.target.value)}
          className={inputClassName}
          type="date"
          required
        />
      </FormField>
    </div>
  );
}
