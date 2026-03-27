'use client';

import { useEffect, useRef, useState } from 'react';
import { ClientSidebar } from '@/components/client/ClientSidebar';
import { ClientHeader } from '@/components/client/ClientHeader';
import { cn } from '@/lib/utils';
import { analyticsService } from '@/lib/api/services/analytics.service';

const RECALC_SESSION_KEY = 'analytics_recalculated';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const recalcTriggered = useRef(false);

  // Background recalculate: once per tab, covers new-tab / page-refresh scenarios
  useEffect(() => {
    if (recalcTriggered.current) return;
    recalcTriggered.current = true;

    if (sessionStorage.getItem(RECALC_SESSION_KEY)) return;

    analyticsService.recalculateAll().then(() => {
      sessionStorage.setItem(RECALC_SESSION_KEY, Date.now().toString());
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Fixed Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <ClientSidebar 
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
      </div>

      {/* Header - positioned after sidebar margin */}
      <ClientHeader
        sidebarCollapsed={sidebarCollapsed}
        onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main Content Area */}
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          // No margin on mobile, responsive margin on desktop
          'md:ml-64',
          sidebarCollapsed && 'md:ml-16'
        )}
      >
        {/* Content Container with Border */}
        <div className="p-6">
          <div
            className={cn(
              // Container styling
              'bg-white dark:bg-slate-900',
              'rounded-xl',
              'border border-slate-200 dark:border-slate-800',
              'shadow-sm',
              // Min height to fill viewport minus header and padding
              'min-h-[calc(100vh-7rem)]',
              // Overflow handling
              'overflow-hidden'
            )}
          >
            {/* Inner scrollable content */}
            <div className="h-full overflow-y-auto p-6">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 md:hidden">
            <ClientSidebar />
          </div>
        </>
      )}
    </div>
  );
}
