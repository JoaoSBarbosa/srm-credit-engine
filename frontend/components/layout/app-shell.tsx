import { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
          <span className="text-lg font-semibold">SRM Credit Engine</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
