'use client';

import { useEffect, useState } from 'react';
import { Users, Mail, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService } from '@/lib/api/services/dashboard.service';

export function DashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await dashboardService.getSummary(); // Using existing service
        setStats(data);
      } catch (e) {
        console.error("Failed to load stats", e);
        // Fallback mock data for visualization if API fails
        setStats({
          totalClients: 120,
          activeCampaigns: 4,
          emailsSent: 12500,
          bounceRate: '2.4%'
        });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
     return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 w-24 bg-muted rounded"></div>
                    <div className="h-4 w-4 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                    <div className="h-8 w-16 bg-muted rounded mb-2"></div>
                    <div className="h-3 w-32 bg-muted rounded"></div>
                </CardContent>
            </Card>
        ))}
     </div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalClients}</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.activeCampaigns}</div>
          <p className="text-xs text-muted-foreground">
            +4 new active campaigns
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.emailsSent}</div>
          <p className="text-xs text-muted-foreground">
            +19% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.bounceRate}</div>
          <p className="text-xs text-muted-foreground">
            -0.5% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
