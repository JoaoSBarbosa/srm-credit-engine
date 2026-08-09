import { CreateBatchReceivableForm } from "@/features/receivables/pages/create-batch-receivable-page";
import { AppShell } from "@/shared/layout/app-shell";

export default function Page() {
  return (
    <AppShell>
      <CreateBatchReceivableForm />
    </AppShell>
  );
}
