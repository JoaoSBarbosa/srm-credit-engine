import type { ReactNode } from "react";

type EmptyProps = {
  message?: string;
  description?: string;
  icon?: ReactNode;
};

export function EmptyState({
  message = "Nenhum registro encontrado.",
  description,
  icon,
}: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
      {icon && <div className="mb-1 text-slate-500">{icon}</div>}

      <p className="text-sm font-medium text-slate-300">{message}</p>

      {description && (
        <p className="max-w-md text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
}
