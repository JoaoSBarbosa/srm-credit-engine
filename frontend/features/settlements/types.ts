export type SettlementStatus =
  | "PENDING"
  | "SETTLED"
  | "CANCELLED"
  | "FAILED"
  | string;

export interface SettlementResponse {
  id: string;
  receivableId: string;
  assignorName: string;
  receivableTypeName: string;
  paymentCurrencyIso: string;
  faceValue: string;
  presentValue: string;
  appliedExchangeRate: string | null;
  netAmount: string;
  status: string;
  createdAt: string;
}

export interface SettlementFilter {
  assignorName?: string;
  currencyIso?: string;
  receivableTypeCode?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export type SettlementPageResponse = {
  content: SettlementResponse[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type SettlementFilterRequest = {
  assignorName?: string;
  currencyIso?: string;
  receivableTypeCode?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
};
