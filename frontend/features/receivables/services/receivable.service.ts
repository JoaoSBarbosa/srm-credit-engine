import type {
  CreateReceivablePayload,
  ReceivableResponse,
} from "@/features/pricing/types";
import { getJson, postJson } from "@/lib/api/client";
import { CreateReceivableBatchPayload } from "../types";

export async function createReceivable(
  payload: CreateReceivablePayload,
): Promise<ReceivableResponse> {
  return postJson<ReceivableResponse>("/api/v1/receivables", payload);
}
export async function createReceivableBatch(
  payload: CreateReceivableBatchPayload,
): Promise<void> {
  return postJson<void>("/api/v1/receivables/batch", payload);
}
export async function getPendingReceivables(): Promise<ReceivableResponse[]> {
  return getJson<ReceivableResponse[]>("/api/v1/receivables");
}
