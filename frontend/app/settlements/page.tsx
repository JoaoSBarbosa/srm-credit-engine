import { SettlementList } from "@/features/settlements/pages/settlement-list";
import { AppShell } from "@/shared/layout/app-shell";

export default function Page() {
  return (
    <AppShell>
      <SettlementList />
    </AppShell>
  );
}
