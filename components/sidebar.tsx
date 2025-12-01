"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Sparkles,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useSidebar } from "./app-shell";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/pos", label: "POS", icon: ShoppingCart },
  { href: "/dashboard/inventory", label: "Inventory", icon: Package },
  { href: "/dashboard/ai-tools", label: "AI Tools", icon: Sparkles },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const { collapsed, setCollapsed } = useSidebar();
  const pathname = usePathname();
  const { businesses, currentBusinessId, setCurrentBusiness } = useStore();
  const currentBusiness = businesses.find((b) => b.id === currentBusinessId);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-slate-200 bg-white transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          {!collapsed && (
            <h1 className="text-xl font-bold text-primary">Bizness</h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>

        {/* Business Switcher */}
        {!collapsed && (
          <div className="border-b border-slate-200 p-4">
            <label className="mb-2 block text-xs font-medium text-slate-500">
              Current Business
            </label>
            <select
              value={currentBusinessId || ""}
              onChange={(e) => setCurrentBusiness(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {businesses.map((business) => (
                <option key={business.id} value={business.id}>
                  {business.name}
                </option>
              ))}
            </select>
            {currentBusiness && (
              <p className="mt-1 text-xs text-slate-400">
                {currentBusiness.type}
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && currentBusiness && (
          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
              <Store size={16} className="text-slate-500" />
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-900">
                  {currentBusiness.name}
                </p>
                <p className="text-xs text-slate-500">{currentBusiness.type}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

