'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignTable, Campaign } from '@/components/campaigns/CampaignTable';

export default function CampaignsPage() {
  // TEMPORARY STATIC DATA
  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Welcome Campaign',
      subject: 'Welcome to our platform',
      status: 'SENT',
      updatedAt: '2026-01-02',
    },
    {
      id: '2',
      name: 'New Feature Announcement',
      subject: 'Check out what’s new!',
      status: 'DRAFT',
      updatedAt: '2026-01-05',
    },
  ];

  const handleDelete = (id: string) => {
    console.log('Delete campaign:', id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Campaigns
          </h1>
          <p className="text-sm text-muted-foreground">
            Create, manage, and track your email campaigns
          </p>
        </div>

        <Link href="/client/campaigns/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignTable
            data={campaigns}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
