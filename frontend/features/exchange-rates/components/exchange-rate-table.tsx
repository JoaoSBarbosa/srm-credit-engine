import { DataTable } from "@/shared/components/table/data-table";
import { Button } from "@/shared/components/button";
import { ExchangeRateResponse } from "../type";

type Props = {
  items: ExchangeRateResponse[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onEdit: (exchangeRate: ExchangeRateResponse) => void;
  onSync: (exchangeRate: ExchangeRateResponse) => void;
};

export function ExchangeRateTable({
  items,
  loading,
  page,
  totalPages,
  totalElements,
  onPageChange,
  onEdit,
  onSync,
}: Props) {
  return (
    <DataTable
      columns={[
        {
          key: "sourceCurrency",
          header: "Origem",
          render: (row) => row.sourceCurrency,
        },
        {
          key: "targetCurrency",
          header: "Destino",
          render: (row) => row.targetCurrency,
        },
        {
          key: "exchangeRate",
          header: "Taxa",
          align: "right",
          render: (row) =>
            row.exchangeRate.toLocaleString("pt-BR", {
              minimumFractionDigits: 6,
              maximumFractionDigits: 6,
            }),
        },
        {
          key: "referenceDate",
          header: "Data de referência",
          render: (row) =>
            new Date(`${row.referenceDate}T00:00:00`).toLocaleDateString(
              "pt-BR",
            ),
        },
        {
          key: "actions",
          header: "Ações",
          align: "right",
          render: (row) => (
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onEdit(row)}
              >
                Editar
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onSync(row)}
              >
                Sincronizar
              </Button>
            </div>
          ),
        },
      ]}
      rows={items}
      rowKey={(row) => row.id}
      loading={loading}
      emptyMessage="Nenhuma taxa de câmbio encontrada."
      pagination={{
        page,
        totalPages,
        totalElements,
        onPageChange,
      }}
    />
  );
}
