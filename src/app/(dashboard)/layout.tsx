"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import { CommandPalette } from "@/components/ui/command-palette";
import { QuickCaptureOverlay, useQuickCapture } from "@/components/ui/quick-capture";
import { StoreProvider, useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { initializeUser } from "@/lib/api-client";

function DashboardInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { loadInitialData } = useStore();
  const { isOpen, close } = useQuickCapture();
  const [initializing, setInitializing] = useState(true);

  // Initialize user and load data
  useEffect(() => {
    if (!authLoading && user) {
      const init = async () => {
        try {
          await initializeUser();
          await loadInitialData();
        } catch (error) {
          console.error("Failed to initialize:", error);
        } finally {
          setInitializing(false);
        }
      };
      init();
    }
  }, [user, authLoading, loadInitialData]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  // Show loading state
  if (authLoading || initializing) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: "var(--bg-primary)" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-[#C17A72] border-[#1F2D47] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#9CA3AF] font-['Space_Grotesk']">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if no user
  if (!user) {
    return null;
  }

  return (
    <>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 relative">
          <Header />
          {/* Background Bloom Elements */}
          <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C17A72]/5 blur-[120px] rounded-full -z-10"></div>
          <div className="fixed bottom-[10%] left-[5%] w-[300px] h-[300px] bg-[#BEC6DF]/5 blur-[100px] rounded-full -z-10"></div>
          <main className="ml-64 pt-24 pb-12 px-12 overflow-auto h-full">{children}</main>
        </div>
      </div>
      <CommandPalette />
      <QuickCaptureOverlay isOpen={isOpen} onClose={close} />
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/p6.png')] z-[100]"></div>
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
