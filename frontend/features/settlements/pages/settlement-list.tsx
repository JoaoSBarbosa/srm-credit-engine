"use client";

import { useSettlements } from "../hooks/use-settlements";
import { SettlementFilters } from "../components/settlement-filters";
import { SettlementTable } from "../components/settlement-table";

export function SettlementList() {
  const {
    items,
    filter,
    loading,
    page,
    pageSize,
    totalPages,
    totalElements,
    applyFilter,
    changePage,
    changePageSize,
  } = useSettlements();

  return (
    <div className="space-y-6">
      <SettlementFilters
        initialValue={filter}
        pageSize={pageSize}
        onPageSizeChange={changePageSize}
        onSubmit={applyFilter}
      />

      <SettlementTable
        rows={items}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={changePage}
      />
    </div>
  );
}
