import { ArrowDownToLine, ClipboardList, FileBarChart } from "lucide-react";

import { HomeActionCard } from "./home-action-card";

export function HomeActions() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Operações</h2>

        <p className="mt-1 text-sm text-slate-500">
          Acesse rapidamente as principais etapas do fluxo de crédito.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <HomeActionCard
          title="Cadastrar recebíveis"
          description="Cadastre um novo recebível ou envie um lote de operações para análise."
          href="/receivables/create"
          icon={ArrowDownToLine}
          primary
        />

        <HomeActionCard
          title="Pendentes de liquidação"
          description="Consulte os recebíveis precificados que estão aguardando liquidação."
          href="/receivables"
          icon={ClipboardList}
          primary
        />

        <HomeActionCard
          title="Extrato de liquidações"
          description="Consulte o histórico das operações liquidadas e seus valores financeiros."
          href="/settlements"
          icon={FileBarChart}
        />
      </div>
    </section>
  );
}
