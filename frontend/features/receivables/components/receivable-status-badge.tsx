import { Badge } from "@/shared/components/badge/badge";
import type { ReceivableStatus } from "../types";

const STATUS_MAP: Record<
  string,
  { label: string; tone: "amber" | "blue" | "emerald" | "slate" }
> = {
  PENDING: { label: "Pendente", tone: "amber" },
  SETTLED: { label: "Liquidado", tone: "emerald" },
  CANCELLED: { label: "Cancelado", tone: "slate" },
};

export function ReceivableStatusBadge({
  status,
}: {
  status: ReceivableStatus;
}) {
  const mapped = STATUS_MAP[status] ?? {
    label: status,
    tone: "slate" as const,
  };
  return <Badge label={mapped.label} tone={mapped.tone} />;
}
