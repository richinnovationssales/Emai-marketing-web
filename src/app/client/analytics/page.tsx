"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart3,
  MousePointerClick,
} from "lucide-react";
import { analyticsService } from "@/lib/api/services/analytics.service";
import { AnalyticsOverview } from "@/types/entities/analytics.types";
import { AnalyticsMetricCard } from "@/components/analytics/AnalyticsMetricCard";
import { DateRangeFilter } from "@/components/analytics/DateRangeFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
        endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
      };

      const response = await analyticsService.getOverview(params);
      setOverview(response.data);
    } catch (err) {
      setError("Failed to load analytics data");
      console.error("Analytics error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [startDate, endDate]);

  const handleDateChange = (newStartDate?: Date, newEndDate?: Date) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Analytics Overview
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
          ))}
        </div>
        <div className="h-[400px] bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Analytics Overview
        </h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {error || "No data available"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare chart data
  const chartData = [
    { name: "Sent", value: overview.totalSent },
    { name: "Delivered", value: overview.totalDelivered },
    { name: "Opened", value: overview.totalOpened },
    { name: "Clicked", value: overview.totalClicked },
    { name: "Bounced", value: overview.totalBounced },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Analytics Overview
        </h2>
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
        />
      </div>

      {/* Primary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsMetricCard
          title="Total Sent"
          value={overview.totalSent}
          icon={Mail}
          description="Total emails sent"
        />
        <AnalyticsMetricCard
          title="Delivered"
          value={overview.totalDelivered}
          icon={TrendingUp}
          description={`${overview.deliveryRate.toFixed(1)}% delivery rate`}
          variant="success"
        />
        <AnalyticsMetricCard
          title="Opened"
          value={overview.totalOpened}
          icon={BarChart3}
          description={`${overview.openRate.toFixed(1)}% open rate`}
        />
        <AnalyticsMetricCard
          title="Clicked"
          value={overview.totalClicked}
          icon={MousePointerClick}
          description={`${overview.clickRate.toFixed(1)}% click rate`}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <AnalyticsMetricCard
          title="Bounced"
          value={overview.totalBounced}
          icon={TrendingDown}
          description={`${overview.bounceRate.toFixed(1)}% bounce rate`}
          variant="warning"
        />
        <AnalyticsMetricCard
          title="Complaints"
          value={overview.totalComplaints}
          icon={AlertTriangle}
          description="Spam complaints"
          variant="danger"
        />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Engagement Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Open Rate</span>
                <span className="font-medium">
                  {overview.openRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Click Rate</span>
                <span className="font-medium">
                  {overview.clickRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Rate</span>
                <span className="font-medium">
                  {overview.deliveryRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Email Metrics Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6366F1"
                fill="url(#colorValue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
