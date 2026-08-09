type ResultItemProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

export function ResultItem({
  label,
  value,
  highlight = false,
}: ResultItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-b-0">
      <span className="text-sm text-slate-400">{label}</span>

      <span
        className={
          highlight
            ? "text-base font-semibold text-white"
            : "text-sm font-medium text-slate-200"
        }
      >
        {value}
      </span>
    </div>
  );
}
