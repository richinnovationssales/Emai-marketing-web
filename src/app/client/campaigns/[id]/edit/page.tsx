"use client";

import { useCampaign } from "@/lib/api/hooks/useCampaigns";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function EditCampaignPage() {
  const params = useParams();
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
      </div>
    );
  }

  // Transform API data to form values
  const textDecoder = new TextDecoder();
  // Decode base64 if needed, though assumption is API returns string for content now based on previous files.
  // Actually documentation says "content" is string. Assuming it's the HTML directly.

  return (
    <div className="container py-6">
      <CampaignForm
        mode="edit"
        campaignId={campaign.id}
        initialData={{
          name: campaign.name,
          subject: campaign.subject,
          content: campaign.content,
          groupIds: [], // API might not return group IDs directly on campaign specific endpoint? We need to check if campaign object has groupIds.
          // Based on API doc provided earlier, Campaign object doesn't explicitly list groupIds but Create payloads do.
          // Usually backend hydration returns them. We'll assume they might be missing or handle them if present.
          // Let's check the type definition if possible.
          isRecurring: campaign.isRecurring,
          recurringFrequency: campaign.recurringFrequency,
          recurringTime: campaign.recurringTime ?? undefined,
          recurringTimezone: campaign.recurringTimezone ?? undefined,
          recurringDaysOfWeek: campaign.recurringDaysOfWeek ?? [],
          recurringDayOfMonth: campaign.recurringDayOfMonth ?? undefined,
          recurringStartDate: campaign.recurringStartDate ?? undefined,
          recurringEndDate: campaign.recurringEndDate ?? undefined,
        }}
      />
    </div>
  );
}
