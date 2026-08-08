import { postJson } from "@/lib/api/client";
import type {
  PricingSimulationPayload,
  PricingSimulationResponse,
} from "../types";

export async function simulatePricing(
  payload: PricingSimulationPayload,
): Promise<PricingSimulationResponse> {
  return postJson<PricingSimulationResponse>(
    "/api/v1/pricings/receivables/simulate",
    payload,
  );
}
