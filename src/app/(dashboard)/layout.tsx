"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { StoreProvider } from "@/lib/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </StoreProvider>
  );
}
