import { getJson, postJson, putJson } from "@/lib/api/client";
import {
  ExchangeRatePage,
  CreateExchangeRateRequest,
  ExchangeRateResponse,
  UpdateExchangeRateRequest,
  ExchangeRateSyncParams,
} from "../type";

const BASE_URL = "/api/v1/exchange-rates";

export async function getExchangeRates(
  page = 0,
  size = 20,
): Promise<ExchangeRatePage> {
  return getJson<ExchangeRatePage>(`${BASE_URL}?page=${page}&size=${size}`);
}

export async function createExchangeRate(
  payload: CreateExchangeRateRequest,
): Promise<ExchangeRateResponse> {
  return postJson<ExchangeRateResponse>(BASE_URL, payload);
}

export async function updateExchangeRate(
  id: string,
  payload: UpdateExchangeRateRequest,
): Promise<ExchangeRateResponse> {
  return putJson<ExchangeRateResponse>(`${BASE_URL}/${id}`, payload);
}

export async function syncExchangeRate(
  params: ExchangeRateSyncParams,
): Promise<ExchangeRateResponse> {
  const searchParams = new URLSearchParams();

  searchParams.set("sourceCurrencyId", params.sourceCurrencyId);

  searchParams.set("targetCurrencyId", params.targetCurrencyId);

  return postJson<ExchangeRateResponse>(
    `${BASE_URL}/sync?${searchParams.toString()}`,
    {},
  );
}
