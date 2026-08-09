export type ReceivableStatus =
  | "PENDING"
  | "ACTIVE"
  | "SETTLED"
  | "CANCELLED"
  | string;

export interface ReceivableResponse {
  id: string;
  assignorId: string;
  assignorName: string;
  receivableType: string;
  currency: string;
  currencyId: string;
  faceValue: string;
  status: ReceivableStatus;
  dueDate: string;
  operationDate: string;
  baseRate: string;
}

export interface ReceivableTypeResponse {
  id: string;
  name: string;
  code: string;
  spreadRate: string;
}

export interface CreateReceivablePayload {
  assignorName: string;
  assignorDocument: string;
  receivableTypeId: string;
  currencyId: string;
  faceValue: string;
  dueDate: string;
  operationDate: string;
  baseRate: string;
}
export type CreateReceivableBatchPayload = {
  receivables: CreateReceivablePayload[];
};
export interface PricingSimulationPayload {
  faceValue: string;
  receivableTypeId: string;
  operationDate: string;
  dueDate: string;
  baseRate: string;
  titleCurrencyId: string;
  paymentCurrencyId: string;
}

export type BatchReceivableItem = {
  key: string;
  data: CreateReceivablePayload;
  expanded: boolean;
};
