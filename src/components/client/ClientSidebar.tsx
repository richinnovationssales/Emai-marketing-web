"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/api/hooks/useAuth";
import { getNavigationByRole } from "@/lib/constants/navigation.constants";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

interface ClientSidebarProps {
  className?: string;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function ClientSidebar({
  className,
  collapsed: controlledCollapsed,
  onCollapsedChange,
}: ClientSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isCollapsed =
    controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleCollapsedChange = (newCollapsed: boolean) => {
    setInternalCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  // Get navigation items based on user role
  const navItems = user?.role ? getNavigationByRole(user.role) : [];

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Or a tailored skeleton matching the sidebar structure
  }

  return (
    <aside
      className={cn(
        // Base layout
        "fixed left-0 top-0 z-30 h-screen flex flex-col",
        // Width transition
        isCollapsed ? "w-16" : "w-64",
        // Theme: Teal/Emerald professional CRM palette
        "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800",
        "border-r border-slate-700/50",
        // Transition
        "transition-all duration-300 ease-in-out",
        className,
      )}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50">
        <Link
          href="/client/dashboard"
          className={cn(
            "flex items-center gap-3 transition-all duration-300",
            isCollapsed && "justify-center",
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-white font-semibold text-sm">
                BEE Smart Campaigns
              </span>
              <span className="text-slate-400 text-xs">Client Portal</span>
            </div>
          )}
        </Link>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCollapsedChange(!isCollapsed)}
          className={cn(
            "h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-700/50",
            isCollapsed &&
              "absolute -right-3 top-6 bg-slate-800 border border-slate-700 shadow-md",
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                  "transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50",
                  isCollapsed && "justify-center px-2",
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon
                  className={cn(
                    "shrink-0",
                    isActive ? "h-5 w-5 text-emerald-400" : "h-5 w-5",
                  )}
                />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto p-3 space-y-2">
        <Separator className="bg-slate-700/50" />

        {/* Help & Settings */}
        <div
          className={cn(
            "space-y-1",
            isCollapsed && "flex flex-col items-center",
          )}
        >
          <Link
            href="/client/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400",
              "hover:text-white hover:bg-slate-700/50 transition-colors",
              isCollapsed && "justify-center px-2",
            )}
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span>Settings</span>}
          </Link>
          <Link
            href="/help"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400",
              "hover:text-white hover:bg-slate-700/50 transition-colors",
              isCollapsed && "justify-center px-2",
            )}
            title={isCollapsed ? "Help" : undefined}
          >
            <HelpCircle className="h-4 w-4" />
            {!isCollapsed && <span>Help Center</span>}
          </Link>
        </div>

        {/* User Section */}
        <div
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50",
            isCollapsed && "justify-center p-2",
          )}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-medium shrink-0">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          {/* {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          )} */}
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {(() => {
                  const name = user?.email?.split("@")[0];
                  return name
                    ? name.charAt(0).toUpperCase() + name.slice(1)
                    : "User";
                })()}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className={cn(
              "h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10 shrink-0",
              isCollapsed && "mt-2",
            )}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
