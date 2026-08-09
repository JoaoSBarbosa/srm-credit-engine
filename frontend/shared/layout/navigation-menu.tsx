"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { navigationMenuItems } from "./navigation-menu.config";

type NavigationMenuProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export function NavigationMenu({
  mobile = false,
  onNavigate,
}: NavigationMenuProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  function toggleMenu(label: string) {
    setOpenMenu((current) => (current === label ? null : label));
  }

  if (mobile) {
    return (
      <nav className="space-y-1">
        {navigationMenuItems.map((item) => {
          const Icon = item.icon;

          if (!item.submenu) {
            return (
              <Link
                key={item.label}
                href={item.href ?? "#"}
                onClick={onNavigate}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                {Icon && <Icon className="h-4 w-4" />}

                {item.label}
              </Link>
            );
          }

          const isOpen = openMenu === item.label;

          return (
            <div key={item.label}>
              <button
                type="button"
                onClick={() => toggleMenu(item.label)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-3">
                  {Icon && <Icon className="h-4 w-4" />}

                  {item.label}
                </span>

                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="ml-3 border-l border-white/10 pl-3">
                  {item.submenu.map((submenuItem) => {
                    const SubmenuIcon = submenuItem.icon;

                    return (
                      <Link
                        key={submenuItem.href}
                        href={submenuItem.href}
                        onClick={onNavigate}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
                      >
                        {SubmenuIcon && <SubmenuIcon className="h-4 w-4" />}

                        {submenuItem.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {navigationMenuItems.map((item) => {
        const Icon = item.icon;

        if (!item.submenu) {
          return (
            <Link
              key={item.label}
              href={item.href ?? "#"}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              {Icon && <Icon className="h-4 w-4" />}

              {item.label}
            </Link>
          );
        }

        const isOpen = openMenu === item.label;

        return (
          <div key={item.label} className="relative">
            <button
              type="button"
              onClick={() => toggleMenu(item.label)}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              aria-expanded={isOpen}
            >
              {Icon && <Icon className="h-4 w-4" />}

              {item.label}

              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-60 rounded-xl border border-white/10 bg-slate-900 p-1.5 shadow-xl">
                {item.submenu.map((submenuItem) => {
                  const SubmenuIcon = submenuItem.icon;

                  return (
                    <Link
                      key={submenuItem.href}
                      href={submenuItem.href}
                      onClick={() => setOpenMenu(null)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      {SubmenuIcon && <SubmenuIcon className="h-4 w-4" />}

                      {submenuItem.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
