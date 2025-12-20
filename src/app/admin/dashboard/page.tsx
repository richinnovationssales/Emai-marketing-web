'use client';

import { Suspense } from 'react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { CampaignsChart } from '@/components/dashboard/CampaignsChart';
import { RecentClients } from '@/components/dashboard/RecentClients';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Reports
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <Suspense fallback={<div>Loading stats...</div>}>
            <DashboardStats />
        </Suspense>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Suspense fallback={<div>Loading chart...</div>}>
                <CampaignsChart />
            </Suspense>
            <Suspense fallback={<div>Loading clients...</div>}>
                <RecentClients />
            </Suspense>
        </div>
      </div>
    </div>
  );
}