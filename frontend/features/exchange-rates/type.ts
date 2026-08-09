import type { PageResponse } from "@/types/api";

export interface ExchangeRateResponse {
  id: string;
  sourceCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  referenceDate: string;
}

export interface CreateExchangeRateRequest {
  sourceCurrencyId: string;
  targetCurrencyId: string;
  exchangeRate: number;
  referenceDate: string;
}

export interface UpdateExchangeRateRequest {
  sourceCurrencyId?: string;
  targetCurrencyId?: string;
  exchangeRate?: number;
  referenceDate?: string;
}

export interface ExchangeRateSyncParams {
  sourceCurrencyId: string;
  targetCurrencyId: string;
}

export type ExchangeRatePage = PageResponse<ExchangeRateResponse>;
