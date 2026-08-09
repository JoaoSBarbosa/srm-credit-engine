import { Calculator, Coins, Database, ShieldCheck } from "lucide-react";

const items = [
  {
    icon: Calculator,
    title: "Motor de precificação",
    description:
      "Cálculo do valor presente considerando taxa base, prazo e risco do recebível.",
  },
  {
    icon: Coins,
    title: "Operações multimoedas",
    description:
      "Suporte a operações em diferentes moedas e conversão cambial na liquidação.",
  },
  {
    icon: ShieldCheck,
    title: "Integridade financeira",
    description:
      "Operações estruturadas para preservar consistência e rastreabilidade dos dados.",
  },
  {
    icon: Database,
    title: "Histórico operacional",
    description:
      "Registro das liquidações para consulta e análise das operações realizadas.",
  },
];

export function HomeInfo() {
  return (
    <section className="border-t border-white/10 pt-8">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Sobre a plataforma</h2>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          O SRM Credit Engine centraliza o ciclo operacional do recebível, desde
          sua entrada até a precificação e liquidação.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl border border-white/10 bg-slate-950/40 p-4"
            >
              <Icon className="h-5 w-5 text-slate-300" />

              <h3 className="mt-4 text-sm font-semibold text-white">
                {item.title}
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
