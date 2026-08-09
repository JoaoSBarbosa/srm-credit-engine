import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  primary?: boolean;
};

export function HomeActionCard({
  title,
  description,
  href,
  icon: Icon,
  primary = false,
}: Props) {
  return (
    <Link
      href={href}
      className={`group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-2xl border p-5 transition ${
        primary
          ? "border-white/20 bg-white/[0.07] hover:border-white/30 hover:bg-white/[0.1]"
          : "border-white/10 bg-slate-950/60 hover:border-white/20 hover:bg-white/[0.05]"
      }`}
    >
      <div>
        <div
          className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl border ${
            primary
              ? "border-white/15 bg-white/10 text-white"
              : "border-white/10 bg-white/5 text-slate-300"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <h2 className="text-base font-semibold text-white">{title}</h2>

        <p className="mt-2 max-w-sm text-sm leading-5 text-slate-400">
          {description}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-300">
        Acessar
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
