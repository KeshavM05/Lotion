"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PageHeaderContextType {
  pageControls: ReactNode | null;
  setPageControls: (controls: ReactNode | null) => void;
}

const PageHeaderContext = createContext<PageHeaderContextType | undefined>(undefined);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [pageControls, setPageControls] = useState<ReactNode | null>(null);

  return (
    <PageHeaderContext.Provider value={{ pageControls, setPageControls }}>
      {children}
    </PageHeaderContext.Provider>
  );
}

export function usePageHeader() {
  const context = useContext(PageHeaderContext);
  if (context === undefined) {
    throw new Error("usePageHeader must be used within a PageHeaderProvider");
  }
  return context;
}
