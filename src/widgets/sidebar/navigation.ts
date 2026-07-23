import {
  ShieldCheck,
  UserRound,
  UsersRound,
  type LucideIcon, LayoutDashboard,
} from "lucide-react";

type SidebarNavigationItem = {
  label: string;
  icon: LucideIcon;
  path: string;
};

export const sidebarNavigation: SidebarNavigationItem[] = [
  { label: "Overview", icon: LayoutDashboard, path: "/overview" },
  { label: "Accounts", icon: UsersRound, path: "/accounts" },
  { label: "Customers", icon: UserRound, path: "/customers" },
  { label: "Roles", icon: ShieldCheck, path: "/roles" },
];
