"use client";

import { usePathname } from "next/navigation";
import { User, Bell } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "./ui/button";

export function Header() {
  const pathname = usePathname();
  const { businesses, currentBusinessId } = useStore();
  const currentBusiness = businesses.find((b) => b.id === currentBusinessId);

  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ label: "Home", href: "/" }];

    paths.forEach((path, index) => {
      const href = "/" + paths.slice(0, index + 1).join("/");
      const label = path.charAt(0).toUpperCase() + path.slice(1);
      breadcrumbs.push({ label, href });
    });

    return breadcrumbs;
  };

  return (
    <header className="fixed right-0 top-0 z-30 h-16 border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2">
          {getBreadcrumbs().map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-2">
              {index > 0 && <span className="text-slate-400">/</span>}
              <a
                href={crumb.href}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                {crumb.label}
              </a>
            </div>
          ))}
          {currentBusiness && (
            <>
              <span className="text-slate-400">/</span>
              <span className="text-sm font-medium text-slate-900">
                {currentBusiness.name}
              </span>
            </>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <User size={20} />
            <span className="text-sm">Profile</span>
          </Button>
        </div>
      </div>
    </header>
  );
}


