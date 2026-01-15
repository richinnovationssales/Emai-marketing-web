"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Eye, Save, Calendar, FileText } from "lucide-react";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

import { GroupSelector } from "./GroupSelector";
import { TemplateSelector } from "./TemplateSelector";
import { RecurringScheduleForm } from "./RecurringScheduleForm";
import { CampaignPreview } from "./CampaignPreview";
import {
  useCreateCampaign,
  useUpdateCampaign,
} from "@/lib/api/hooks/useCampaigns";
import { Template } from "@/types/entities/template.types";
import { RecurringFrequency } from "@/types/entities/campaign.types";

// Dynamic import for CampaignEditor to avoid SSR issues with GrapeJS
const CampaignEditor = dynamic(
  () =>
    import("./CampaignEditor").then((mod) => ({ default: mod.CampaignEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] border rounded-lg flex items-center justify-center bg-muted/30">
        Loading editor...
      </div>
    ),
  }
);

/* ---------------- Schema ---------------- */

const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required").max(255),
  subject: z.string().min(1, "Subject is required").max(500),
  content: z.string().min(1, "Content is required"),
  groupIds: z.array(z.string()).min(1, "Select at least one recipient group"),

  // Recurring Schedule
  isRecurring: z.boolean().default(false),
  recurringFrequency: z
    .enum(["NONE", "DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY", "CUSTOM"])
    .default("NONE"),
  recurringTime: z.string().optional(),
  recurringTimezone: z.string().optional(),
  recurringDaysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  recurringDayOfMonth: z.number().min(1).max(31).optional(),
  recurringStartDate: z.string().optional(),
  recurringEndDate: z.string().optional(),
  customCronExpression: z.string().optional(),
  sendImmediately: z.boolean().default(true),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

interface CampaignFormProps {
  mode?: "create" | "edit";
  initialData?: Partial<CampaignFormValues>;
  campaignId?: string;
}

export function CampaignForm({
  mode = "create",
  initialData,
  campaignId,
}: CampaignFormProps) {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<
    string | undefined
  >();

  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const isSubmitting = createCampaign.isPending || updateCampaign.isPending;

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      subject: "",
      content: "",
      groupIds: [],
      isRecurring: false,
      recurringFrequency: "NONE",
      recurringTime: "09:00",
      recurringTimezone: "Asia/Kolkata",
      recurringDaysOfWeek: [],
      sendImmediately: true,
      ...initialData,
    },
  });

  const { watch, setValue } = form;
  const content = watch("content");
  const subject = watch("subject");
  const isRecurring = watch("isRecurring");
  const recurringFrequency = watch("recurringFrequency");

  /* ---------------- Template Selection ---------------- */

  const handleTemplateSelect = (template: Template | null) => {
    if (template) {
      setSelectedTemplateId(template.id);
      setValue("subject", template.subject, { shouldValidate: true });
      setValue("content", template.content, { shouldValidate: true });
    } else {
      setSelectedTemplateId(undefined);
      // Clear content when switching to no template
      setValue("content", "", { shouldValidate: false });
    }
  };

  /* ---------------- Schedule Field Updates ---------------- */

  const handleScheduleChange = (field: string, value: any) => {
    setValue(field as keyof CampaignFormValues, value, {
      shouldValidate: true,
    });
  };

  /* ---------------- Submit ---------------- */

  function onSubmit(data: CampaignFormValues) {
    // Build API payload
    const payload = {
      name: data.name,
      subject: data.subject,
      content: data.content,
      groupIds: data.groupIds,
      isRecurring: data.isRecurring,
      ...(data.isRecurring && {
        recurringFrequency: data.recurringFrequency,
        recurringTime: data.recurringTime,
        recurringTimezone: data.recurringTimezone,
        ...(data.recurringDaysOfWeek?.length && {
          recurringDaysOfWeek: data.recurringDaysOfWeek,
        }),
        ...(data.recurringDayOfMonth && {
          recurringDayOfMonth: data.recurringDayOfMonth,
        }),
        ...(data.recurringStartDate && {
          recurringStartDate: data.recurringStartDate,
        }),
        ...(data.recurringEndDate && {
          recurringEndDate: data.recurringEndDate,
        }),
        ...(data.customCronExpression && {
          customCronExpression: data.customCronExpression,
        }),
      }),
      ...(!data.isRecurring && { sendImmediately: data.sendImmediately }), // Only applicable if not recurring
    };

    if (mode === "edit" && campaignId) {
      updateCampaign.mutate(
        { id: campaignId, data: payload },
        {
          onSuccess: () => {
            router.push("/client/campaigns");
          },
        }
      );
    } else {
      createCampaign.mutate(payload, {
        onSuccess: () => {
          router.push("/client/campaigns");
        },
      });
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {mode === "create" ? "Create Campaign" : "Edit Campaign"}
        </h1>
        <p className="text-muted-foreground">
          Design your email campaign and configure delivery settings
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* ========== LEFT PANEL - Email Content Only ========== */}
            <div className="lg:col-span-2 space-y-6">
              {/* Email Content Card */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    Email Content
                  </CardTitle>
                  <CardDescription>
                    Design the email your recipients will receive. Drag blocks
                    to build your layout.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Subject */}
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Subject</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 🎉 Don't miss our Summer Sale!"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Content Editor */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Body</FormLabel>
                        <FormControl>
                          <CampaignEditor
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* ========== RIGHT PANEL - Campaign Details + Schedule + Actions ========== */}
            <div className="lg:col-span-1 space-y-6">
              {/* Campaign Details Card */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Campaign Details</CardTitle>
                  <CardDescription>
                    Basic information about your campaign
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Campaign Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Summer Sale Announcement"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Internal name to identify this campaign
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Template Selection */}
                  <div className="space-y-2">
                    <Label>Use Template (Optional)</Label>
                    <TemplateSelector
                      selectedId={selectedTemplateId}
                      onSelect={handleTemplateSelect}
                    />
                    <p className="text-xs text-muted-foreground">
                      Select a template to auto-fill subject and content
                    </p>
                  </div>

                  {/* Recipients - Group Selection */}
                  <FormField
                    control={form.control}
                    name="groupIds"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Recipients</FormLabel>
                        <FormControl>
                          <GroupSelector
                            selectedIds={field.value}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                          />
                        </FormControl>
                        <FormDescription>
                          Select recipient groups
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Schedule & Frequency Card */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">
                      Schedule & Frequency
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Configure when and how often to send
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecurringScheduleForm
                    isRecurring={isRecurring}
                    frequency={recurringFrequency as RecurringFrequency}
                    time={watch("recurringTime")}
                    timezone={watch("recurringTimezone")}
                    daysOfWeek={watch("recurringDaysOfWeek")}
                    dayOfMonth={watch("recurringDayOfMonth")}
                    startDate={
                      watch("recurringStartDate")
                        ? new Date(watch("recurringStartDate")!)
                        : undefined
                    }
                    endDate={
                      watch("recurringEndDate")
                        ? new Date(watch("recurringEndDate")!)
                        : undefined
                    }
                    customCron={watch("customCronExpression")}
                    onChange={handleScheduleChange}
                  />
                </CardContent>
              </Card>

              {/* Actions Card */}
              <Card className="sticky bottom-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-3">
                    {/* Send Immediately Checkbox */}
                    {!isRecurring && (
                      <FormField
                        control={form.control}
                        name="sendImmediately"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Send Immediately</FormLabel>
                              <FormDescription>
                                If unchecked, campaign will be saved as draft
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    )}

                    {content && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowPreview(true)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview Email
                      </Button>
                    )}

                    <Separator />

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>

                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          mode === "create" ? (
                            "Creating..."
                          ) : (
                            "Saving..."
                          )
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            {mode === "create" ? "Create" : "Save"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>

      {showPreview && (
        <CampaignPreview
          html={content}
          customMessage={subject}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
