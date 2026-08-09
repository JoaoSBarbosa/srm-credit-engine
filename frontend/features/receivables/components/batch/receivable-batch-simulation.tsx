"use client";

import { useEffect, useState } from "react";

import { simulatePricing } from "@/features/pricing/services/pricing.service";
import type { PricingSimulationResponse } from "@/features/pricing/types";
import { formatCurrency, formatPercent } from "@/utils/formatters";

import type { CreateReceivablePayload } from "../../types";

type Props = {
  receivable: CreateReceivablePayload;
};

export function ReceivableBatchSimulation({ receivable }: Props) {
  const [simulation, setSimulation] =
    useState<PricingSimulationResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const required = Boolean(
    receivable.faceValue &&
    receivable.receivableTypeId &&
    receivable.currencyId &&
    receivable.operationDate &&
    receivable.dueDate &&
    receivable.baseRate,
  );

  useEffect(() => {
    if (!required) {
      return;
    }

    let cancelled = false;

    async function execute() {
      setLoading(true);

      try {
        const response = await simulatePricing({
          faceValue: receivable.faceValue,
          receivableTypeId: receivable.receivableTypeId,
          operationDate: receivable.operationDate,
          dueDate: receivable.dueDate,
          baseRate: receivable.baseRate,
          titleCurrencyId: receivable.currencyId,
          paymentCurrencyId: receivable.currencyId,
        });

        if (!cancelled) {
          setSimulation(response);
        }
      } catch {
        if (!cancelled) {
          setSimulation(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    const timeout = window.setTimeout(() => {
      void execute();
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [
    required,
    receivable.faceValue,
    receivable.receivableTypeId,
    receivable.currencyId,
    receivable.operationDate,
    receivable.dueDate,
    receivable.baseRate,
  ]);

  if (!required) {
    return null;
  }

  if (loading) {
    return (
      <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-slate-400">Calculando simulação...</p>
      </div>
    );
  }

  if (!simulation) {
    return null;
  }

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <div className="rounded-lg border border-white/10 bg-black/20 p-3">
        <p className="text-xs text-slate-500">Taxa total</p>

        <p className="mt-1 font-semibold text-white">
          {formatPercent(Number(simulation.totalRate) * 100)}
        </p>
      </div>

      <div className="rounded-lg border border-white/10 bg-black/20 p-3">
        <p className="text-xs text-slate-500">Valor presente</p>

        <p className="mt-1 font-semibold text-white">
          {formatCurrency(simulation.presentValue)}
        </p>
      </div>

      <div className="rounded-lg border border-white/10 bg-black/20 p-3">
        <p className="text-xs text-slate-500">Valor líquido</p>

        <p className="mt-1 font-semibold text-emerald-300">
          {formatCurrency(simulation.netAmount)}
        </p>
      </div>
    </div>
  );
}
