"use client";
import type { PricingSimulationResponse } from "@/features/pricing/types";
import type { ReceivableTypeOption } from "@/features/receivable-types/types";
import { formatCurrency } from "@/utils/formatters";

type SimulationRecebiveisProps = {
  selectedType: ReceivableTypeOption | null;
  preview: PricingSimulationResponse | null;
};

export function SimulationRecebiveis({
  selectedType,
  preview,
}: SimulationRecebiveisProps) {
  return (
    <aside className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
        <p className="text-sm text-slate-400">Simulação em tempo real</p>

        <div className="mt-4 space-y-3 text-sm text-slate-200">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-slate-400">Spread</p>
            <p className="mt-1 text-xl font-semibold text-white">
              {selectedType ? `${selectedType.spreadRate}%` : "—"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-slate-400">Valor presente</p>
            <p className="mt-1 text-xl font-semibold text-white">
              {preview ? formatCurrency(preview.presentValue) : "—"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-slate-400">Valor líquido</p>
            <p className="mt-1 text-xl font-semibold text-white">
              {preview ? formatCurrency(preview.netAmount) : "—"}
            </p>
          </div>
        </div>
      </section>
    </aside>
  );
}
