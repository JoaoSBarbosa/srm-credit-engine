import type { InputHTMLAttributes } from "react";

type MaskedInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  onChange: (value: string) => void;
  format: (value: string) => string;
};

export function MaskedInput({
  onChange,
  format,
  value,
  ...props
}: MaskedInputProps) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange(format(event.target.value));
  }

  return (
    <input
      {...props}
      value={value ?? ""}
      onChange={handleChange}
    />
  );
}