type Props = {
  status: string;
};

const STATUS_LABELS: Record<string, string> = {
  SETTLED: "Liquidado",
  PENDING: "Pendente",
  CANCELLED: "Cancelado",
};

export function SettlementStatusBadge({ status }: Props) {
  const label = STATUS_LABELS[status] ?? status;

  return (
    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300">
      {label}
    </span>
  );
}
