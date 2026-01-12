"use client";

import { useEffect, useState } from "react";
import { Mail, Users, TrendingUp, BarChart3 } from "lucide-react";
import { clientService } from "@/lib/api/services/client.service";
import { ClientAnalytics } from "@/types/entities/client.types";
import { AnalyticsMetricCard } from "@/components/analytics/AnalyticsMetricCard";

interface SystemMetrics {
  totalEmailsSent: number;
  totalCampaigns: number;
  totalClients: number;
  activeClients: number;
}

export function SystemAnalyticsCards() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSystemMetrics() {
      try {
        const allClients = await clientService.getAll();

        // Fetch analytics for all clients
        const analyticsPromises = allClients.map(async (client) => {
          try {
            return await clientService.getAnalytics(client.id);
          } catch {
            return null;
          }
        });

        const allAnalytics = await Promise.all(analyticsPromises);

        // Calculate system-wide metrics
        const totalEmailsSent = allAnalytics.reduce((sum, analytics) => {
          return sum + (analytics?.totalEmailsSent || 0);
        }, 0);

        const totalCampaigns = allAnalytics.reduce((sum, analytics) => {
          return (
            sum +
            ((analytics?.campaignsSent || 0) +
              (analytics?.campaignsScheduled || 0))
          );
        }, 0);

        const activeClients = allClients.filter((c) => c.isActive).length;

        setMetrics({
          totalEmailsSent,
          totalCampaigns,
          totalClients: allClients.length,
          activeClients,
        });
      } catch (error) {
        console.error("Failed to load system metrics:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSystemMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <AnalyticsMetricCard
        title="Total Emails Sent"
        value={metrics.totalEmailsSent}
        icon={Mail}
        description="Across all clients"
      />
      <AnalyticsMetricCard
        title="Total Campaigns"
        value={metrics.totalCampaigns}
        icon={TrendingUp}
        description="Sent and scheduled"
      />
      <AnalyticsMetricCard
        title="Total Clients"
        value={metrics.totalClients}
        icon={Users}
        description={`${metrics.activeClients} active`}
        variant="success"
      />
      <AnalyticsMetricCard
        title="Active Clients"
        value={metrics.activeClients}
        icon={BarChart3}
        description={`${(
          (metrics.activeClients / metrics.totalClients) *
          100
        ).toFixed(0)}% of total`}
      />
    </div>
  );
}
