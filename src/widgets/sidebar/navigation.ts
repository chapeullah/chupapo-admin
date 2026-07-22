import {
  ShieldCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

type SidebarNavigationItem = {
  label: string;
  icon: LucideIcon;
  path: string;
};

export const sidebarNavigation: SidebarNavigationItem[] = [
  { label: "Accounts", icon: UsersRound, path: "/accounts" },
  { label: "Roles", icon: ShieldCheck, path: "/roles" },
];
