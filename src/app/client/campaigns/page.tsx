"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignTable } from "@/components/campaigns/CampaignTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useCampaigns, useDeleteCampaign } from "@/lib/api/hooks/useCampaigns";

export default function CampaignsPage() {
  const { data: campaigns, isLoading, error } = useCampaigns();
  const deleteCampaign = useDeleteCampaign();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      deleteCampaign.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
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
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Failed to load campaigns. Please try again.
            </div>
          ) : campaigns && campaigns.length > 0 ? (
            <CampaignTable
              data={campaigns.map((c) => ({
                id: c.id,
                name: c.name,
                subject: c.subject,
                status: c.status,
                updatedAt: c.updatedAt,
                groups: c?.groups?.map((g: { id: string; name: string }) => ({ id: g.id, name: g.name })),
              }))}
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No campaigns yet. Create your first campaign to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
