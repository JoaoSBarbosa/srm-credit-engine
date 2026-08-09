import { HomeActions } from "@/features/home/home-actions";
import { HomeHero } from "@/features/home/home-hero";
import { HomeInfo } from "@/features/home/home-info";
import { AppShell } from "@/shared/layout/app-shell";

export default function Home() {
  return (
    <AppShell>
      <main className="mx-auto w-full max-w-7xl space-y-10">
        <HomeHero />
        <HomeActions />
        <HomeInfo />
      </main>
    </AppShell>
  );
}
