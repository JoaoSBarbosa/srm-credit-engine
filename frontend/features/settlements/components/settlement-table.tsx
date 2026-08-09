import { formatCurrency, formatDate, formatPercent } from "@/utils/formatters";

import type { SettlementResponse } from "../types";
import { SettlementStatusBadge } from "./settlement-status-badge";
import {
  DataTableColumn,
  DataTable,
} from "@/shared/components/table/data-table";

type Props = {
  rows: SettlementResponse[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
};

export function SettlementTable({
  rows,
  loading,
  page,
  totalPages,
  totalElements,
  onPageChange,
}: Props) {
  const columns: DataTableColumn<SettlementResponse>[] = [
    {
      key: "assignor",
      header: "Cedente",
      render: (row: SettlementResponse) => (
        <span className="font-medium text-white">{row.assignorName}</span>
      ),
    },
    {
      key: "type",
      header: "Tipo",
      render: (row: SettlementResponse) => (
        <span className="text-slate-300">{row.receivableTypeName}</span>
      ),
    },
    {
      key: "currency",
      header: "Moeda",
      render: (row: SettlementResponse) => (
        <span className="font-medium text-slate-200">
          {row.paymentCurrencyIso}
        </span>
      ),
    },
    {
      key: "faceValue",
      header: "Valor de face",
      render: (row: SettlementResponse) =>
        formatCurrency(row.faceValue, row.paymentCurrencyIso),
    },
    {
      key: "presentValue",
      header: "Valor presente",
      render: (row: SettlementResponse) =>
        formatCurrency(row.presentValue, row.paymentCurrencyIso),
    },
    {
      key: "exchangeRate",
      header: "Câmbio",
      render: (row: SettlementResponse) =>
        row.appliedExchangeRate
          ? formatPercent(Number(row.appliedExchangeRate) * 100)
          : "-",
    },
    {
      key: "netAmount",
      header: "Valor líquido",
      render: (row: SettlementResponse) => (
        <span className="font-semibold text-emerald-300">
          {formatCurrency(row.netAmount, row.paymentCurrencyIso)}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Data",
      render: (row: SettlementResponse) => (
        <span className="text-slate-400">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: SettlementResponse) => (
        <SettlementStatusBadge status={row.status} />
      ),
    },
  ];

  return (
    <DataTable<SettlementResponse>
      columns={columns}
      rows={rows}
      rowKey={(row) => row.id}
      loading={loading}
      emptyMessage="Nenhuma liquidação encontrada."
      pagination={{
        page,
        totalPages,
        totalElements,
        onPageChange,
      }}
    />
  );
}
