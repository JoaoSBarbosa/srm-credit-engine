type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  id: string;
  label: string;
  error?: string;
  disabled?: boolean;
  loading?: boolean;
  options: SelectOption[];
  registration: object;
};

export function SelectField({
  id,
  label,
  error,
  disabled,
  loading,
  options,
  registration,
}: SelectFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-200"
      >
        {label}
      </label>

      <select
        id={id}
        disabled={disabled}
        {...registration}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
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
