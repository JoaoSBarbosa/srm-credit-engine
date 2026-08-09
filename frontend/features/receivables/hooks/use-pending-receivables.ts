"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { getPendingReceivables } from "../services/receivable.service";
import { ReceivableResponse } from "../types";

export function usePendingReceivables() {
  const [items, setItems] = useState<ReceivableResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getPendingReceivables();

      setItems(response);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os recebíveis pendentes.";

      setItems([]);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return {
    items,
    loading,
    reload: load,
  };
}
