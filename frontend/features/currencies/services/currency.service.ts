import { getJson, postJson, putJson } from "@/lib/api/client";
import type { PageResponse } from "@/types/api";
import { CurrencyRequest, CurrencyResponse } from "../types";
const BASE_URL = "/api/v1/currencies";

export async function getCurrencies(): Promise<PageResponse<CurrencyResponse>> {
  return getJson<PageResponse<CurrencyResponse>>(`${BASE_URL}?page=0&size=100`);
}
export async function createCurrency(
  payload: CurrencyRequest,
): Promise<PageResponse<CurrencyResponse>> {
  return postJson<PageResponse<CurrencyResponse>>(`${BASE_URL}`, payload);
}
export async function updateCurrency(
  id: string,
  payload: CurrencyRequest,
): Promise<CurrencyResponse> {
  return putJson<CurrencyResponse>(`${BASE_URL}/${id}`, payload);
}
