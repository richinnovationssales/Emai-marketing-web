"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  Mail,
  Users,
  TrendingUp,
  CalendarIcon,
  Loader2,
} from "lucide-react";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { dashboardService } from "@/lib/api/services/dashboard.service";
import { exportDashboardToExcel } from "@/lib/utils/export-utils";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

/* ===================== API ===================== */

const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await dashboardService.getClientDashboard();

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
      emailsRemaining: 0,
    };

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

  // Date range state
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchDashboardData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  // Filter campaign stats by selected date range
  const filteredCampaignStats = useMemo(() => {
    if (!data) return [];
    if (!startDate && !endDate) return data.campaignStats;

    return data.campaignStats.filter((c) => {
      const campaignDate = c.date.split(" to ")[0];
      if (!campaignDate || campaignDate === "Not sent") return false;
      const d = new Date(campaignDate);
      if (startDate && d < startDate) return false;
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (d > endOfDay) return false;
      }
      return true;
    });
  }, [data, startDate, endDate]);

  // Aggregate daily performance data for chart + export
  const areaChartData = useMemo(() => {
    const map: Record<
      string,
      { date: string; delivered: number; opened: number }
    > = {};

    filteredCampaignStats.forEach((item) => {
      const date = item.date.split(" to ")[0];
      if (!map[date]) {
        map[date] = { date, delivered: 0, opened: 0 };
      }
      map[date].delivered += item.delivered;
      map[date].opened += item.opened;
    });

    return Object.values(map).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [filteredCampaignStats]);

  const handleDateChange = (start?: Date, end?: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleResetDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setDatePickerOpen(false);
  };

  const handleDownload = () => {
    if (!data) return;

    setExporting(true);
    try {
      const dateRange =
        startDate && endDate
          ? {
              start: format(startDate, "yyyy-MM-dd"),
              end: format(endDate, "yyyy-MM-dd"),
            }
          : undefined;

      exportDashboardToExcel({
        stats: data.stats,
        campaignStats: filteredCampaignStats,
        dailyPerformance: areaChartData,
        dateRange,
      });
    } finally {
      setExporting(false);
    }
  };

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

  const { stats } = data;

  const totalDelivered = filteredCampaignStats.reduce(
    (a, b) => a + b.delivered,
    0
  );
  const totalOpened = filteredCampaignStats.reduce(
    (a, b) => a + b.opened,
    0
  );
  const openRate =
    totalDelivered > 0
      ? ((totalOpened / totalDelivered) * 100).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-3">
          {/* Date Range Picker */}
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "w-[260px] justify-start text-left font-normal",
                  !startDate && !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate && endDate ? (
                  <>
                    {format(startDate, "LLL dd, y")} -{" "}
                    {format(endDate, "LLL dd, y")}
                  </>
                ) : startDate ? (
                  <>{format(startDate, "LLL dd, y")} - Select end</>
                ) : (
                  "Select date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="flex gap-2 p-3">
                <div>
                  <p className="text-sm font-medium mb-2">Start Date</p>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => handleDateChange(date, endDate)}
                    disabled={(date) =>
                      date > new Date() || (endDate ? date > endDate : false)
                    }
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">End Date</p>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => handleDateChange(startDate, date)}
                    disabled={(date) =>
                      date > new Date() ||
                      (startDate ? date < startDate : false)
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 p-3 border-t">
                <Button variant="outline" size="sm" onClick={handleResetDates}>
                  Reset
                </Button>
                <Button size="sm" onClick={() => setDatePickerOpen(false)}>
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Download Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={exporting}
          >
            {exporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download Report
          </Button>
        </div>
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
          <div className="flex items-center justify-between">
            <CardTitle>Campaign Statistics</CardTitle>
            {(startDate || endDate) && (
              <p className="text-sm text-muted-foreground">
                Showing {filteredCampaignStats.length} of{" "}
                {data.campaignStats.length} campaigns
              </p>
            )}
          </div>
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
                {filteredCampaignStats.length > 0 ? (
                  filteredCampaignStats.map((c, i) => (
                    <tr key={i} className="border-b hover:bg-muted/40">
                      <td className="p-4 font-medium">{c.name}</td>
                      <td className="p-4">{c.date}</td>
                      <td className="p-4">{c.delivered}</td>
                      <td className="p-4">{c.opened}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No campaigns found for the selected date range.
                    </td>
                  </tr>
                )}
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
