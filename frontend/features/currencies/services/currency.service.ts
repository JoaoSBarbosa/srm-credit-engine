import { getJson } from "@/lib/api/client";
import type { PageResponse } from "@/types/api";
import { CurrencyOption } from "../types";

export async function getCurrencies(): Promise<PageResponse<CurrencyOption>> {
  return getJson<PageResponse<CurrencyOption>>(
    "/api/v1/currencies?page=0&size=100",
  );
}
