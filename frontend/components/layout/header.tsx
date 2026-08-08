import Image from "next/image";

export function Header() {
  return (
    <header className="border-b border-white/10 bg-slate-900/80">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="SRM Credit Engine"
            width={36}
            height={36}
            priority
          />

          <span className="text-base font-semibold sm:text-lg">
            SRM Credit Engine
          </span>
        </div>
      </div>
    </header>
  );
}
