import type { CoreLayoutProps } from "ra-core";

import Sidebar from "@widgets/sidebar";

import "./admin-layout.css";

export default function AdminLayout({
                                      children,
                                    }: CoreLayoutProps) {
  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-layout__main">
        {children}
      </main>
    </div>
  );
}