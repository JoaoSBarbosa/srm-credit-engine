import type { InputHTMLAttributes } from "react";

type PercentageInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> & {
  value?: string;
  onChange: (value: string) => void;
};

function formatPercentage(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }
  const number = Number(digits) / 100;
  return number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function normalizePercentage(value: string): string {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const number = Number(normalized);
  if (!Number.isFinite(number)) {
    return "";
  }
  return number.toFixed(2);
}

export function PercentageInput({
  value = "",
  onChange,
  onBlur,
  ...props
}: PercentageInputProps) {
  const displayValue = value
    ? Number(value).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "";

  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={(event) => {
        const formatted = formatPercentage(event.target.value);

        if (!formatted) {
          onChange("");
          return;
        }

        onChange(normalizePercentage(formatted));
      }}
      onBlur={onBlur}
    />
  );
}
