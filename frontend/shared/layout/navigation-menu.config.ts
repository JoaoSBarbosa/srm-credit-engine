import type { LucideIcon } from "lucide-react";
import { CircleDollarSign, Coins, FileText, Plus, Receipt } from "lucide-react";

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
    label: "Recebíveis",
    icon: Receipt,
    submenu: [
      {
        label: "Pendentes de liquidação",
        href: "/receivables",
        icon: FileText,
      },
      {
        label: "Cadastrar recebível",
        href: "/receivables/create",
        icon: Plus,
      },
      {
        label: "Cadastrar lote",
        href: "/receivables/create/batch",
        icon: Plus,
      },
    ],
  },
  {
    label: "Moedas",
    icon: Coins,
    href: "/currencies",
  },
  {
    label: "Liquidações",
    icon: CircleDollarSign,
    href: "/settlements",
  },
];
