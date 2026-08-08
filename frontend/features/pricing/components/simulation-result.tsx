import { ResultItem } from "@/shared/components/result-item";
import type { PricingSimulationResponse } from "../types";

type SimulationResultProps = {
  simulation: PricingSimulationResponse | null;
};

function formatCurrency(value: string) {
  return Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatRate(value: string) {
  return `${(Number(value) * 100).toFixed(2)}%`;
}

export function SimulationResult({ simulation }: SimulationResultProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">
          Resultado da simulação
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          O resultado é calculado pelo motor de precificação.
        </p>
      </div>

      {!simulation ? (
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-slate-700 px-6 text-center">
          <p className="text-sm text-slate-500">
            Preencha os dados da operação para visualizar a simulação.
          </p>
        </div>
      ) : (
        <div>
          <ResultItem
            label="Valor de face"
            value={formatCurrency(simulation.faceValue)}
          />

          <ResultItem
            label="Spread"
            value={formatRate(simulation.spreadRate)}
          />

          <ResultItem
            label="Taxa total"
            value={formatRate(simulation.totalRate)}
          />

          <ResultItem
            label="Prazo"
            value={`${simulation.installments} mês(es)`}
          />

          <ResultItem
            label="Valor presente"
            value={formatCurrency(simulation.presentValue)}
          />

          {simulation.appliedExchangeRate !== null && (
            <ResultItem
              label="Taxa de câmbio"
              value={Number(simulation.appliedExchangeRate).toFixed(4)}
            />
          )}

          <div className="mt-4 rounded-xl bg-white/5 px-4 py-3">
            <ResultItem
              label="Valor líquido"
              value={formatCurrency(simulation.netAmount)}
              highlight
            />
          </div>
        </div>
      )}
    </section>
  );
}
