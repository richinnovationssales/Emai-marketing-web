"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  Users,
  Mail,
  MousePointerClick,
  Ban,
  AlertTriangle,
} from "lucide-react";
import { analyticsService } from "@/lib/api/services/analytics.service";
import { CampaignAnalyticsDetail } from "@/types/entities/analytics.types";
import { AnalyticsMetricCard } from "@/components/analytics/AnalyticsMetricCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function CampaignDetailAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [data, setData] = useState<CampaignAnalyticsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaignAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await analyticsService.getCampaignAnalytics(
          campaignId
        );
        setData(response.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Campaign not found");
        } else {
          setError("Failed to load campaign analytics");
        }
        console.error("Campaign analytics error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchCampaignAnalytics();
    }
  }, [campaignId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            Campaign Analytics
          </h2>
        </div>
        <div className="space-y-4">
          <div className="h-32 bg-muted rounded animate-pulse" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            Campaign Analytics
          </h2>
        </div>
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

  const { campaign, analytics } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">{campaign.name}</h2>
          <p className="text-muted-foreground mt-1">{campaign.subject}</p>
        </div>
        <Link href={`/client/analytics/campaigns/${campaignId}/timeline`}>
          <Button variant="outline">View Timeline</Button>
        </Link>
      </div>

      {/* Campaign Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="mt-1">{campaign.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sent Date</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">
                  {campaign.sentAt
                    ? format(new Date(campaign.sentAt), "MMM dd, yyyy HH:mm")
                    : "Not sent"}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Campaign ID</p>
              <p className="font-mono text-sm mt-1">{campaign.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsMetricCard
          title="Total Sent"
          value={analytics.totalSent}
          icon={Mail}
          description="Recipients"
        />
        <AnalyticsMetricCard
          title="Delivered"
          value={analytics.totalDelivered}
          icon={TrendingUp}
          description={`${(
            (analytics.totalDelivered / analytics.totalSent) * 100 || 0
          ).toFixed(1)}% delivery rate`}
          variant="success"
        />
        <AnalyticsMetricCard
          title="Unique Opens"
          value={analytics.uniqueOpens}
          icon={Users}
          description={`${analytics.openRate.toFixed(1)}% open rate`}
        />
        <AnalyticsMetricCard
          title="Unique Clicks"
          value={analytics.uniqueClicks}
          icon={MousePointerClick}
          description={`${analytics.clickRate.toFixed(1)}% click rate`}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsMetricCard
          title="Total Opens"
          value={analytics.totalOpened}
          description="Including duplicates"
        />
        <AnalyticsMetricCard
          title="Total Clicks"
          value={analytics.totalClicked}
          description="Including duplicates"
        />
        <AnalyticsMetricCard
          title="Bounced"
          value={analytics.totalBounced}
          icon={Ban}
          description={`${analytics.bounceRate.toFixed(1)}% bounce rate`}
          variant="warning"
        />
        <AnalyticsMetricCard
          title="Spam Complaints"
          value={analytics.totalComplaints}
          icon={AlertTriangle}
          description="Spam reports"
          variant="danger"
        />
      </div>

      {/* Engagement Details */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Open Rate</span>
                <span className="font-medium">
                  {analytics.openRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min(analytics.openRate, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">
                  Click-Through Rate
                </span>
                <span className="font-medium">
                  {analytics.clickRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${Math.min(analytics.clickRate, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">
                  Bounce Rate
                </span>
                <span className="font-medium">
                  {analytics.bounceRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: `${Math.min(analytics.bounceRate, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm">Unsubscribed</span>
                <span className="font-medium">
                  {analytics.totalUnsubscribed.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm">Engagement Rate</span>
                <span className="font-medium">
                  {(
                    ((analytics.uniqueOpens + analytics.uniqueClicks) /
                      analytics.totalSent) *
                      100 || 0
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm">Click-to-Open Rate</span>
                <span className="font-medium">
                  {analytics.uniqueOpens > 0
                    ? (
                        (analytics.uniqueClicks / analytics.uniqueOpens) *
                        100
                      ).toFixed(1)
                    : "0.0"}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Successful Deliveries</span>
                <span className="font-medium">
                  {analytics.totalDelivered.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
