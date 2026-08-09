
import type { ChangeEventHandler, SelectHTMLAttributes } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectRegistration = {
  name?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  onBlur?: () => void;
  ref?: (element: HTMLSelectElement | null) => void;
};

type SelectFieldProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  label: string;
  error?: string;
  loading?: boolean;
  options: SelectOption[];
  registration?: SelectRegistration;
};

const selectClassName =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:opacity-60";

export function SelectField({
  id,
  label,
  error,
  loading = false,
  disabled = false,
  options,
  registration,
  className = "",
  ...props
}: SelectFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-300"
      >
        {label}
      </label>

      <select
        id={id}
        disabled={disabled || loading}
        {...registration}
        {...props}
        className={[selectClassName, className].filter(Boolean).join(" ")}
      >
        <option value="">{loading ? "Carregando..." : "Selecione"}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
