import { BarChart3, CircleDollarSign, ShieldCheck } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-6 sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-slate-700/10 blur-3xl" />

      <div className="relative max-w-3xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
          <CircleDollarSign className="h-3.5 w-3.5" />
          Plataforma de crédito multimoedas
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
          SRM Credit Engine
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
          Plataforma para gestão, precificação e liquidação de recebíveis
          financeiros em diferentes moedas, com foco em segurança,
          rastreabilidade e precisão nas operações.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-slate-300" />
            Operações auditáveis
          </div>

          <div className="inline-flex items-center gap-2 text-xs text-slate-400">
            <CircleDollarSign className="h-4 w-4 text-slate-300" />
            Multimoedas
          </div>

          <div className="inline-flex items-center gap-2 text-xs text-slate-400">
            <BarChart3 className="h-4 w-4 text-slate-300" />
            Precificação financeira
          </div>
        </div>
      </div>
    </section>
  );
}
