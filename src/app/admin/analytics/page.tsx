"use client";

import { SystemAnalyticsCards } from "@/components/admin/SystemAnalyticsCards";
import { ClientPerformanceTable } from "@/components/admin/ClientPerformanceTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground">
            System-wide performance metrics and client analytics
          </p>
        </div>
      </div>

      {/* System-wide Metrics */}
      <SystemAnalyticsCards />

      {/* Client Performance */}
      <ClientPerformanceTable />
    </div>
  );
}
