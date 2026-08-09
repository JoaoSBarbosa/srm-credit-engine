"use client";

import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { NavigationMenu } from "./navigation-menu";
import Link from "next/link";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="border-b border-white/10 bg-slate-950">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="SRM Credit Engine"
              width={32}
              height={32}
              priority
            />

            <span className="text-base font-semibold text-white sm:text-lg">
              SRM Credit Engine
            </span>
          </div>
        </Link>
        <NavigationMenu />

        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="rounded-lg p-2 text-slate-300 transition hover:bg-white/5 hover:text-white md:hidden"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 px-4 py-3 md:hidden">
          <div className="mx-auto max-w-7xl">
            <NavigationMenu mobile onNavigate={closeMobileMenu} />
          </div>
        </div>
      )}
    </header>
  );
}
