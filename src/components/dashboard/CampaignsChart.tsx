"use client";

import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dashboardService } from "@/lib/api/services/dashboard.service";
import { format, subMonths } from "date-fns";
import { useMemo } from "react";

export function CampaignsChart() {
  const endDate = useMemo(() => new Date(), []);
  const startDate = useMemo(() => subMonths(endDate, 6), [endDate]);

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaignPerformance', {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    }],
    queryFn: () => dashboardService.getCampaignPerformance({
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const chartData = useMemo(() => {
    if (!campaigns.length) return [];

    // Group campaigns by month
    const monthlyData = campaigns.reduce((acc: any, campaign: any) => {
      const month = format(new Date(campaign.createdAt), "MMM");

      if (!acc[month]) {
        acc[month] = { name: month, total: 0, success: 0 };
      }

      acc[month].total += 1;
      // Assume campaigns with updatedAt after createdAt were successful
      if (new Date(campaign.updatedAt) > new Date(campaign.createdAt)) {
        acc[month].success += 1;
      }

      return acc;
    }, {});

    return Object.values(monthlyData);
  }, [campaigns]);

  if (isLoading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[350px] w-full bg-muted/20 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>Email delivery performance over time</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--muted-foreground))"
              opacity={0.2}
            />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted)/0.3)" }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Bar
              dataKey="total"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              name="Total Sent"
            />
            <Bar
              dataKey="success"
              fill="hsl(var(--emerald-500))"
              radius={[4, 4, 0, 0]}
              name="Delivered"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
