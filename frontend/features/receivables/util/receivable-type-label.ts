const RECEIVABLE_TYPE_LABELS: Record<string, string> = {
  DUPLICATA_MERCANTIL: "Duplicata Mercantil",
  CHEQUE_PRE_DATADO: "Cheque Pré-datado",
};

export function getReceivableTypeLabel(type: string): string {
  return (
    RECEIVABLE_TYPE_LABELS[type] ??
    type
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}
