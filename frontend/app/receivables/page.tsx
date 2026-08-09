import { PendingReceivables } from "@/features/receivables/pages/pending-receivables";
import { AppShell } from "@/shared/layout/app-shell";

export default function Page() {
  return (
    <AppShell>
      <PendingReceivables />
    </AppShell>
  );
}
