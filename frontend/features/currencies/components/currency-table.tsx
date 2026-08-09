"use client";

import {
  DataTableColumn,
  DataTable,
} from "@/shared/components/table/data-table";
import type { CurrencyResponse } from "../types";

type Props = {
  items: CurrencyResponse[];
  loading: boolean;
  onEdit: (currency: CurrencyResponse) => void;
};

export function CurrencyTable({ items, loading, onEdit }: Props) {
  const columns: DataTableColumn<CurrencyResponse>[] = [
    {
      key: "isoCode",
      header: "Código",
      render: (row) => (
        <span className="font-semibold text-white">{row.isoCode}</span>
      ),
    },
    {
      key: "name",
      header: "Nome",
      render: (row) => <span className="text-slate-300">{row.name}</span>,
    },
    {
      key: "action",
      header: "Ação",
      align: "center",
      render: (row) => (
        <button
          type="button"
          onClick={() => onEdit(row)}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          Editar
        </button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={items}
      rowKey={(row) => row.id}
      loading={loading}
      emptyMessage="Nenhuma moeda cadastrada."
    />
  );
}
