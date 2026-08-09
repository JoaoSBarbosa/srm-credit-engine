import type { LucideIcon } from "lucide-react";
import { Calculator, Coins, FileText, Home, Plus, Receipt } from "lucide-react";

export type NavigationSubmenuItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

export type NavigationMenuItem = {
  label: string;
  href?: string;
  icon?: LucideIcon;
  submenu?: NavigationSubmenuItem[];
};

export const navigationMenuItems: NavigationMenuItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    label: "Recebíveis",
    icon: Receipt,
    submenu: [
      {
        label: "Consultar recebíveis",
        href: "/receivables",
        icon: FileText,
      },
      {
        label: "Novo recebível",
        href: "/receivables/create",
        icon: Plus,
      },
      {
        label: "Novo lote",
        href: "/receivables/create/batch",
        icon: Plus,
      },
    ],
  },
  {
    label: "Pricing",
    icon: Calculator,
    submenu: [
      {
        label: "Simulação",
        href: "/pricing",
        icon: Calculator,
      },
    ],
  },
  {
    label: "Moedas",
    icon: Coins,
    submenu: [
      {
        label: "Consultar moedas",
        href: "/currencies",
        icon: Coins,
      },
    ],
  },
];
