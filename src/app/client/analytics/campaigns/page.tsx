"use client";

import { useEffect, useRef, useState } from "react";
import { analyticsService } from "@/lib/api/services/analytics.service";
import { CampaignAnalyticsSummary } from "@/types/entities/analytics.types";
import { CampaignPerformanceTable } from "@/components/analytics/CampaignPerformanceTable";
import { Card, CardContent } from "@/components/ui/card";

export default function CampaignsAnalyticsPage() {
  const [campaigns, setCampaigns] = useState<CampaignAnalyticsSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await analyticsService.getAllCampaignsAnalytics();
        setCampaigns(response.data);
      } catch (err) {
        setError("Failed to load campaigns analytics");
        console.error("Campaigns analytics error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Campaign Analytics
        </h2>
        <div className="h-[500px] bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Campaign Analytics
        </h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Campaign Analytics
        </h2>
        <p className="text-sm text-muted-foreground">
          {campaigns.length} campaigns
        </p>
      </div>

      <CampaignPerformanceTable campaigns={campaigns} />
    </div>
  );
}
