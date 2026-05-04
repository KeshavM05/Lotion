"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import { CommandPalette } from "@/components/ui/command-palette";
import { QuickCaptureOverlay, useQuickCapture } from "@/components/ui/quick-capture";
import { StoreProvider } from "@/lib/store";

function DashboardInner({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useQuickCapture();

  return (
    <>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 relative">
          <Header />
          {/* Background Bloom Elements */}
          <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C17A72]/5 blur-[120px] rounded-full -z-10"></div>
          <div className="fixed bottom-[10%] left-[5%] w-[300px] h-[300px] bg-[#BEC6DF]/5 blur-[100px] rounded-full -z-10"></div>
          <main className="ml-0 pt-24 pb-12 px-12 overflow-auto h-full">{children}</main>
        </div>
      </div>
      <CommandPalette />
      <QuickCaptureOverlay isOpen={isOpen} onClose={close} />
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <DashboardInner>{children}</DashboardInner>
    </StoreProvider>
  );
}
