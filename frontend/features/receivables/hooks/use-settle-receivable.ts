"use client";

import { calculatePricing } from "@/features/pricing/services/pricing.service";
import { PricingResponse } from "@/features/pricing/types";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type SettleReceivableParams = {
  receivableId: string;
  paymentCurrencyId: string;
  settlementDate: string;
};

export function useSettleReceivable() {
  const [settlement, setSettlement] = useState<PricingResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const settleReceivable = useCallback(
    async ({
      receivableId,
      paymentCurrencyId,
      settlementDate,
    }: SettleReceivableParams) => {
      try {
        setLoading(true);
        setError(null);
        setSettlement(null);

        const response = await calculatePricing(receivableId, {
          paymentCurrencyId,
          settlementDate,
        });

        setSettlement(response);

        toast.success("Recebível liquidado com sucesso.");

        return response;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Não foi possível liquidar o recebível.";

        setError(message);
        toast.error(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setSettlement(null);
    setError(null);
  }, []);

  return {
    settlement,
    loading,
    error,
    settleReceivable,
    reset,
  };
}
