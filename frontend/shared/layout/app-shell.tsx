import type { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Header />

      <main className="mx-auto w-full max-w-[1440px]  flex-1 px-6 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}
