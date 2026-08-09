export interface CurrencyResponse {
  id: string;
  isoCode: string;
  name: string;
}

export interface CurrencyRequest {
  isoCode: string;
  name: string;
}
