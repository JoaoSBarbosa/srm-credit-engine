import type { CurrencyRequest, CurrencyResponse } from "../types";
import { updateCurrency } from "../services/currency.service";

export async function editCurrency(
  currency: CurrencyResponse,
  payload: CurrencyRequest,
): Promise<CurrencyResponse> {
  return updateCurrency(currency.id, payload);
}
