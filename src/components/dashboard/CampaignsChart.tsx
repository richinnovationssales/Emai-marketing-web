'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for initial visualization as analytics service might need complex backend setup
const mockData = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
    success: Math.floor(Math.random() * 4000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
    success: Math.floor(Math.random() * 4000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
    success: Math.floor(Math.random() * 4000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
    success: Math.floor(Math.random() * 4000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
    success: Math.floor(Math.random() * 4000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
    success: Math.floor(Math.random() * 4000) + 1000,
  },
];

export function CampaignsChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
        setData(mockData);
        setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
      return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[350px] w-full bg-muted/20 animate-pulse rounded"></div>
            </CardContent>
        </Card>
      )
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>
            Email delivery performance over time
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.2} />
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
                cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                }}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Total Sent" />
            <Bar dataKey="success" fill="hsl(var(--emerald-500))" radius={[4, 4, 0, 0]} name="Delivered" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
