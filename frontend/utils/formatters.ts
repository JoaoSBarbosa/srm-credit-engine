export function formatCurrency(
  value: string | number | null | undefined,
  currency = "BRL",
) {
  const numberValue = typeof value === "number" ? value : Number(value ?? 0);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
}

export function formatDate(value?: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function formatPercent(value?: string | number | null) {
  const numberValue = typeof value === "number" ? value : Number(value ?? 0);
  return `${numberValue.toFixed(2)}%`;
}
export function normalizeDocument(document: string): string {
  return document.replace(/\D/g, "");
}
