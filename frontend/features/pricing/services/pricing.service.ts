import { postJson } from "@/lib/api/client";
import type {
  PricingRequestPayload,
  PricingResponse,
  PricingSimulationPayload,
  PricingSimulationResponse,
} from "../types";

const BASE_PRICING_URL = "/api/v1/pricings";

export async function simulatePricing(
  payload: PricingSimulationPayload,
): Promise<PricingSimulationResponse> {
  return postJson(`${BASE_PRICING_URL}/receivables/simulate`, payload);
}

export async function calculatePricing(
  receivableId: string,
  payload: PricingRequestPayload,
): Promise<PricingResponse> {
  return postJson(
    `${BASE_PRICING_URL}/receivables/${receivableId}/settle`,
    payload,
  );
}
