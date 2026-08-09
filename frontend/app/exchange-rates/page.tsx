import { ExchangeRateList } from "@/features/exchange-rates/page/exchange-rate-list";
import { AppShell } from "@/shared/layout/app-shell";

export default function Page() {
  return (
    <AppShell>
      <ExchangeRateList />
    </AppShell>
  );
}
