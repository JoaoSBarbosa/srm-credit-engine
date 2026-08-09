import type { InputHTMLAttributes } from "react";
import { MaskedInput } from "./masked-input";

type CurrencyInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> & {
  value?: string;
  onChange: (value: string) => void;
};

function formatCurrencyInput(value: string): string {
  const normalized = value.replace(/[^\d,]/g, "").replace(/,+/g, ",");
  const [integer = "", decimal] = normalized.split(",");
  const formattedInteger = integer.replace(/^0+(?=\d)/, "");
  if (decimal === undefined) {
    return formattedInteger;
  }
  return `${formattedInteger || "0"},${decimal.slice(0, 2)}`;
}

export function CurrencyInput({
  value,
  onChange,
  ...props
}: CurrencyInputProps) {
  return (
    <MaskedInput
      {...props}
      value={value}
      onChange={onChange}
      format={formatCurrencyInput}
      inputMode="decimal"
    />
  );
}
