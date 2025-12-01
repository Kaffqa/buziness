"use client";

import { useState, createContext, useContext } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

const SidebarContext = createContext<{
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}>({ collapsed: false, setCollapsed: () => {} });

export const useSidebar = () => useContext(SidebarContext);

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="flex h-screen">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${collapsed ? "pl-20" : "pl-64"}`}>
          <Header />
          <main className="mt-16 p-6">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
