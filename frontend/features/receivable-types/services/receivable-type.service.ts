import { getJson } from "@/lib/api/client";
import type { PageResponse } from "@/types/api";
import { ReceivableTypeOption } from "../types";

export async function getReceivableTypes(): Promise<
  PageResponse<ReceivableTypeOption>
> {
  return getJson<PageResponse<ReceivableTypeOption>>(
    "/api/v1/receivable-types?page=0&size=100",
  );
}
