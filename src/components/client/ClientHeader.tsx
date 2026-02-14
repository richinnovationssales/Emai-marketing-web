"use client";

import Link from "next/link";
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/api/hooks/useAuth";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ClientHeaderProps {
  onMenuClick?: () => void;
  sidebarCollapsed?: boolean;
}

export function ClientHeader({
  onMenuClick,
  sidebarCollapsed = false,
}: ClientHeaderProps) {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-20 h-16",
        "border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md",
        "border-slate-200 dark:border-slate-700/50",
        "transition-all duration-300",
        // Full width on mobile, offset on desktop
        "left-0 md:left-64",
        sidebarCollapsed && "md:left-16",
      )}
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-600 dark:text-slate-400"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search..."
                className="w-64 pl-10 h-9 bg-slate-100 dark:bg-slate-800 border-transparent focus:border-emerald-500 dark:focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ModeToggle />

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <Bell className="h-5 w-5" />
            {/* Notification Badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <div className="w-8 h-8 rounded-full first-letter:uppercase bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-900 dark:text-white first-letter:uppercase">
                    {user?.email?.split("@")[0] || "User"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Client
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  {/* <p className="text-sm font-medium">{user?.email?.split('@')[0]}</p> */}
                  <p className="text-sm font-medium">
                    {(() => {
                      const name = user?.email?.split("@")[0];
                      return name
                        ? name.charAt(0).toUpperCase() + name.slice(1)
                        : "User";
                    })()}
                  </p>

                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/client/settings/profile">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/client/settings">Account Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 dark:text-red-400 cursor-pointer"
                onClick={logout}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
