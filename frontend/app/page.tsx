import { AppShell } from "@/shared/layout/app-shell";

export default function Home() {
  return (
    <AppShell>
      <section>
        <h1 className="text-2xl font-semibold">SRM Credit Engine</h1>
        <p className="mt-2 text-slate-400">
          Plataforma de cessão de crédito multimoedas.
        </p>
      </section>
    </AppShell>
  );
}
