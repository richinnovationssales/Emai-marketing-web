"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Download, Mail, Users, TrendingUp } from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardService } from "@/lib/api/services/dashboard.service";
import { format } from "date-fns";

/* ===================== TYPES ===================== */

interface DashboardStats {
  contacts: number;
  campaigns: number;
  emailsSent: number;
  emailsRemaining: number;
}

interface CampaignStat {
  name: string;
  date: string;
  delivered: number;
  opened: number;
}

interface DashboardData {
  stats: DashboardStats;
  campaignsPerMonth: { month: string; count: number }[];
  campaignStats: CampaignStat[];
}

/* ===================== MOCK API ===================== */

const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await dashboardService.getClientDashboard();

    // Transform API response to match dashboard structure
    const stats: DashboardStats = {
      contacts: response.contacts.length,
      campaigns: response.campaigns.length,
      emailsSent: response.campaigns.reduce((total, campaign) => {
        return (
          total +
          (campaign.emailEvents?.filter((e) => e.eventType === "SENT").length ||
            0)
        );
      }, 0),
      emailsRemaining: 0, // This should come from plan data if available
    };

    // Calculate campaign stats from campaigns with email events
    const campaignStats: CampaignStat[] = response.campaigns
      .filter((c) => c.sentAt)
      .map((campaign) => {
        const delivered =
          campaign.emailEvents?.filter((e) => e.eventType === "DELIVERED")
            .length || 0;
        const opened =
          campaign.emailEvents?.filter((e) => e.eventType === "OPENED")
            .length || 0;

        return {
          name: campaign.name,
          date: campaign.sentAt
            ? `${format(new Date(campaign.sentAt), "yyyy-MM-dd")} to ${format(
                new Date(campaign.sentAt),
                "yyyy-MM-dd"
              )}`
            : "Not sent",
          delivered,
          opened,
        };
      });

    // Group campaigns by month
    const campaignsPerMonth = response.campaigns.reduce((acc, campaign) => {
      const month = format(new Date(campaign.createdAt), "MMMM");
      const existing = acc.find((item) => item.month === month);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ month, count: 1 });
      }
      return acc;
    }, [] as { month: string; count: number }[]);

    return {
      stats,
      campaignsPerMonth,
      campaignStats,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    // Return empty data structure on error
    return {
      stats: {
        contacts: 0,
        campaigns: 0,
        emailsSent: 0,
        emailsRemaining: 0,
      },
      campaignsPerMonth: [],
      campaignStats: [],
    };
  }
};

/* ===================== COMPONENT ===================== */

export default function ClientDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
     if (fetchedRef.current) return;
    fetchDashboardData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const areaChartData = useMemo(() => {
    if (!data) return [];

    const map: Record<
      string,
      { date: string; delivered: number; opened: number }
    > = {};

    data.campaignStats.forEach((item) => {
      const date = item.date.split(" to ")[0];
      if (!map[date]) {
        map[date] = { date, delivered: 0, opened: 0 };
      }
      map[date].delivered += item.delivered;
      map[date].opened += item.opened;
    });

    return Object.values(map);
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-1/4 bg-muted rounded" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded" />
          ))}
        </div>
        <div className="h-[320px] bg-muted rounded" />
      </div>
    );
  }

  if (!data) return null;

  const { stats, campaignStats } = data;

  const totalDelivered = campaignStats.reduce((a, b) => a + b.delivered, 0);
  const totalOpened = campaignStats.reduce((a, b) => a + b.opened, 0);
  const openRate =
    totalDelivered > 0
      ? ((totalOpened / totalDelivered) * 100).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download Reports
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Contacts" value={stats.contacts} icon={<Users />} />
        <StatCard
          title="Campaigns"
          value={stats.campaigns}
          icon={<TrendingUp />}
        />
        <StatCard
          title="Emails Sent"
          value={stats.emailsSent}
          icon={<Mail />}
        />
        <StatCard
          title="Emails Remaining"
          value={stats.emailsRemaining}
          icon={<Mail />}
        />
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <MiniStat title="Delivered" value={totalDelivered} />
        <MiniStat title="Opened" value={totalOpened} />
        <MiniStat title="Open Rate" value={`${openRate}%`} />
      </div>

      {/* Gradient Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaChartData}>
              <defs>
                <linearGradient id="delivered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="opened" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="delivered"
                stroke="#6366F1"
                fill="url(#delivered)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="opened"
                stroke="#22C55E"
                fill="url(#opened)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Campaign Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left">Campaign</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Delivered</th>
                  <th className="p-4 text-left">Opened</th>
                </tr>
              </thead>
              <tbody>
                {campaignStats.map((c, i) => (
                  <tr key={i} className="border-b hover:bg-muted/40">
                    <td className="p-4 font-medium">{c.name}</td>
                    <td className="p-4">{c.date}</td>
                    <td className="p-4">{c.delivered}</td>
                    <td className="p-4">{c.opened}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ===================== SMALL COMPONENTS ===================== */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function MiniStat({ title, value }: { title: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}



