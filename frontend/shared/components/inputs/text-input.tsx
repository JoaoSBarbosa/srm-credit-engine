import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

const inputClassName =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-slate-500 disabled:cursor-not-allowed disabled:opacity-60";

export function TextInput({ className = "", ...props }: TextInputProps) {
  return (
    <input
      {...props}
      className={[inputClassName, className].filter(Boolean).join(" ")}
    />
  );
}
