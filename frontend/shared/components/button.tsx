import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "link"
  | "dark"
  | "light";

type ButtonSize = "sm" | "md";
type ButtonCursor =
  | "default"
  | "pointer"
  | "not-allowed"
  | "wait"
  | "grab"
  | "grabbing";
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  fullWidth?: boolean;
  cursor?: ButtonCursor;
};

const baseClassName =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/50";

const variantClassName: Record<ButtonVariant, string> = {
  primary: "bg-white text-slate-950 hover:bg-slate-200",
  secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700",
  outline:
    "border border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800",
  ghost: "bg-transparent text-slate-300 hover:bg-white/5",
  danger: "bg-red-600 text-white hover:bg-red-500",
  success: "bg-emerald-600 text-white hover:bg-emerald-500",
  warning: "bg-amber-500 text-slate-950 hover:bg-amber-400",
  info: "bg-blue-600 text-white hover:bg-blue-500",
  link: "bg-transparent p-0 text-slate-300 underline-offset-4 hover:text-white hover:underline",
  dark: "bg-slate-950 text-slate-200 hover:bg-slate-800",
  light: "bg-slate-100 text-slate-900 hover:bg-white",
};

const sizeClassName: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};
const cursorClassName: Record<ButtonCursor, string> = {
  default: "cursor-default",
  pointer: "cursor-pointer",
  "not-allowed": "cursor-not-allowed",
  wait: "cursor-wait",
  grab: "cursor-grab",
  grabbing: "cursor-grabbing",
};
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  loadingText,
  leftIcon,
  fullWidth = false,
  disabled,
  cursor = "pointer",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        baseClassName,
        variantClassName[variant],
        cursorClassName[cursor],
        sizeClassName[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading ? (
        <span
          aria-hidden
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        leftIcon
      )}

      {loading && loadingText ? loadingText : children}
    </button>
  );
}
