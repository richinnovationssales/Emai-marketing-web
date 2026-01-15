"use client";

import { useCampaign } from "@/lib/api/hooks/useCampaigns";
import { Loader2, Edit2, Calendar, Users, Mail } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CampaignStatusBadge from "@/components/campaigns/CampaignStatusBadge";
import { format } from "date-fns";
import dynamic from "next/dynamic";

// Use a simplified read-only view for content or reuse editor in disabled mode if possible.
// For now, let's render HTML safely.
function ContentPreview({ html }: { html: string }) {
  return (
    <div className="border rounded-md p-4 bg-white min-h-[300px]">
      <iframe
        title="Email Preview"
        srcDoc={html}
        className="w-full h-full min-h-[500px] border-none"
        sandbox="allow-same-origin"
      />
    </div>
  );
}

export default function ViewCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const {
    data: campaign,
    isLoading,
    isError,
  } = useCampaign(params.id as string);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <p className="text-destructive font-medium">Failed to load campaign</p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{campaign.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <span className="text-sm">
              Created {format(new Date(campaign.createdAt), "MMM d, yyyy")}
            </span>
            <span>•</span>
            <CampaignStatusBadge status={campaign.status} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/client/campaigns")}
          >
            Back to List
          </Button>
          <Button
            onClick={() => router.push(`/client/campaigns/${campaign.id}/edit`)}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Campaign
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel: Preview */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                Email Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-semibold text-sm text-muted-foreground">
                  Subject:
                </span>
                <p className="text-lg font-medium mt-1">{campaign.subject}</p>
              </div>
              <Separator />
              <div>
                <span className="font-semibold text-sm text-muted-foreground mb-2 block">
                  Body Preview:
                </span>
                <ContentPreview html={campaign.content} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Schedule Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Schedule & Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block">Recurring</span>
                  <span className="font-medium">
                    {campaign.isRecurring ? "Yes" : "No"}
                  </span>
                </div>
                {campaign.isRecurring && (
                  <>
                    <div>
                      <span className="text-muted-foreground block">
                        Frequency
                      </span>
                      <span className="font-medium">
                        {campaign.recurringFrequency}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Time</span>
                      <span className="font-medium">
                        {campaign.recurringTime} {campaign.recurringTimezone}
                      </span>
                    </div>
                  </>
                )}
                <div>
                  <span className="text-muted-foreground block">
                    Last Updated
                  </span>
                  <span className="font-medium">
                    {format(new Date(campaign.updatedAt), "MMM d, yyyy HH:mm")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats / Other Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Recipient Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* If we had concrete group names, we'd list them. For now, showing count. */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Target Groups</span>
                  <span className="font-medium">
                    {campaign._count?.groups || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
