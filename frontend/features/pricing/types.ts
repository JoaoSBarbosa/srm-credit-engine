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
  appliedExchangeRate: string;
  netAmount: string;
};

export type PricingRequestPayload = {
  paymentCurrencyId: string;
  settlementDate: string;
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
