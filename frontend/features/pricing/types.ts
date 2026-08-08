export type PricingSimulationPayload = {
  faceValue: string;
  receivableTypeId: string;
  operationDate: string;
  dueDate: string;
  baseRate: string;
  titleCurrencyId: string;
  paymentCurrencyId: string;
};

export type PricingSimulationResponse = {
  faceValue: string;
  spreadRate: string;
  totalRate: string;
  installments: number;
  presentValue: string;
  appliedExchangeRate: string | null;
  netAmount: string;
};

export type CreateReceivablePayload = {
  assignorName: string;
  assignorDocument: string;
  receivableTypeId: string;
  currencyId: string;
  faceValue: string;
  dueDate: string;
  operationDate: string;
  baseRate: string;
};

export type ReceivableResponse = {
  id: string;
  assignorId: string;
  assignorName: string;
  receivableType: string;
  currency: string;
  faceValue: string;
  status: string;
  dueDate: string;
  operationDate: string;
  baseRate: string;
};

export type PricingRequestPayload = {
  paymentCurrencyId: string;
};

export type PricingResponse = {
  settlementId: string;
  faceValue: string;
  spreadRate: string;
  totalRate: string;
  installments: number;
  presentValue: string;
  appliedExchangeRate: string | null;
  netAmount: string;
};