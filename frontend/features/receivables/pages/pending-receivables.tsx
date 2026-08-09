"use client";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/table/data-table";
import { formatCurrency, formatDate, formatPercent } from "@/utils/formatters";

import { usePendingReceivables } from "../hooks/use-pending-receivables";
import { ReceivableStatusBadge } from "../components/receivable-status-badge";
import { getReceivableTypeLabel } from "../util/receivable-type-label";
import { Button } from "@/shared/components/button";
import { ReceivableResponse } from "../types";
import { useSettleReceivable } from "../hooks/use-settle-receivable";

export function PendingReceivables() {
  const { items, loading, reload } = usePendingReceivables();
  const { settleReceivable, loading: settling } = useSettleReceivable();

  const handleSettle = async (receivable: ReceivableResponse) => {
    try {
      await settleReceivable({
        receivableId: receivable.id,
        paymentCurrencyId: receivable.currencyId,
        settlementDate: new Date().toISOString().split("T")[0],
      });

      await reload();
    } catch {}
  };
  const columns: DataTableColumn<ReceivableResponse>[] = [
    {
      key: "assignor",
      header: "Cedente",
      render: (row) => (
        <span className="font-medium text-white">{row.assignorName}</span>
      ),
    },
    {
      key: "type",
      header: "Tipo",
      render: (row) => (
        <span className="font-medium text-slate-200">
          {getReceivableTypeLabel(row.receivableType)}
        </span>
      ),
    },
    {
      key: "currency",
      header: "Moeda",
      render: (row) => <span className="text-slate-400">{row.currency}</span>,
    },

    {
      key: "faceValue",
      header: "Valor de face",
      render: (row) => formatCurrency(row.faceValue, row.currency),
    },
    {
      key: "baseRate",
      header: "Taxa base",
      render: (row) => formatPercent(Number(row.baseRate) * 100),
    },
    {
      key: "dueDate",
      header: "Vencimento",
      render: (row) => (
        <span className="text-slate-400">{formatDate(row.dueDate)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <ReceivableStatusBadge status={row.status} />,
    },

    {
      key: "action",
      header: "Ação",
      align: "center",
      render: (row) => (
        <Button variant={"success"} onClick={() => handleSettle(row)}>
          Liquidar recebível
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={items}
      rowKey={(row) => row.id}
      loading={loading}
      emptyMessage="Nenhum recebível pendente de liquidação."
    />
  );
}
