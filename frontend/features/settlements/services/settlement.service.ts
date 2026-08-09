import { getJson } from "@/lib/api/client";
import type { PageResponse } from "@/types/api";

import type { SettlementFilter, SettlementResponse } from "../types";

export async function getSettlements(
  filter: SettlementFilter,
  page: number,
  size: number,
): Promise<PageResponse<SettlementResponse>> {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("size", String(size));

  if (filter.assignorName) {
    params.set("assignorName", filter.assignorName);
  }

  if (filter.currencyIso) {
    params.set("currencyIso", filter.currencyIso);
  }

  if (filter.receivableTypeCode) {
    params.set("receivableTypeCode", filter.receivableTypeCode);
  }

  if (filter.status) {
    params.set("status", filter.status);
  }

  if (filter.startDate) {
    params.set("startDate", filter.startDate);
  }

  if (filter.endDate) {
    params.set("endDate", filter.endDate);
  }

  return getJson<PageResponse<SettlementResponse>>(
    `/api/v1/settlements?${params.toString()}`,
  );
}
