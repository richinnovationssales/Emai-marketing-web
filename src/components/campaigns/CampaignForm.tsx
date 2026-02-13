"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Eye, Save, Calendar, FileText } from "lucide-react";

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
import { RichTextEditor } from "./RichTextEditor";

import {
  useCreateCampaign,
  useUpdateCampaign,
} from "@/lib/api/hooks/useCampaigns";
import { Template } from "@/types/entities/template.types";
import { RecurringFrequency } from "@/types/entities/campaign.types";

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

/**
 * Merges the user-written rich text body with a selected HTML template.
 *
 * Strategy (in priority order):
 *  1. If the template contains a `{{content}}` placeholder → inject body there.
 *  2. If the template contains a `<body>` tag → prepend body as the first child of <body>.
 *  3. Fallback → prepend body wrapped in a <div> directly above the raw template HTML.
 *
 * This ensures the body is ALWAYS included regardless of template structure.
 */
function mergeBodyWithTemplate(body: string, templateHtml: string): string {
  if (!body) return templateHtml;
  if (!templateHtml) return body;

  const wrappedBody = `<div class="campaign-body-content" style="margin-bottom:16px;">${body}</div>`;

  // 1. Explicit placeholder
  if (templateHtml.includes("{{content}}")) {
    return templateHtml.replace("{{content}}", wrappedBody);
  }

  // 2. Has a <body> tag — insert as first child
  if (/<body[\s>]/i.test(templateHtml)) {
    return templateHtml.replace(
      /(<body[^>]*>)/i,
      `$1\n${wrappedBody}\n`
    );
  }

  // 3. Bare HTML / fragment — prepend body above the template
  return `${wrappedBody}\n${templateHtml}`;
}

export function CampaignForm({
  mode = "create",
  initialData,
  campaignId,
}: CampaignFormProps) {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>();
  /**
   * We keep the raw template HTML separately so we can always re-merge
   * if the user edits the body after picking a template.
   */
  const [selectedTemplateHtml, setSelectedTemplateHtml] = useState<string>("");

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

  /* ---------------- Template Selection Logic ---------------- */

  const handleTemplateSelect = (template: Template | null) => {
    if (template) {
      setSelectedTemplateId(template.id);
      setSelectedTemplateHtml(template.content);
      setValue("subject", template.subject, { shouldValidate: true });

      // Merge current body with newly selected template
      const currentBody = form.getValues("content");
      const merged = mergeBodyWithTemplate(currentBody, template.content);
      setValue("content", merged, { shouldValidate: true });
    } else {
      // Template deselected — restore just the body without template HTML
      setSelectedTemplateId(undefined);
      setSelectedTemplateHtml("");
      // We can't perfectly "un-merge" HTML, so we leave content as-is.
      // If desired, you could store the original body separately and restore it here.
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
    const payload = {
      content: data.content, // Already contains merged body + template
      subject: data.subject,
      name: data.name,
      groupIds: data.groupIds,
      isRecurring: data.isRecurring,
      ...(data.isRecurring
        ? {
            recurringFrequency: data.recurringFrequency,
            recurringTime: data.recurringTime,
            recurringTimezone: data.recurringTimezone,
            recurringDaysOfWeek: data.recurringDaysOfWeek,
            recurringDayOfMonth: data.recurringDayOfMonth,
            recurringStartDate: data.recurringStartDate,
            recurringEndDate: data.recurringEndDate,
            customCronExpression: data.customCronExpression,
          }
        : {
            sendImmediately: data.sendImmediately,
          }),
    };

    if (mode === "edit" && campaignId) {
      updateCampaign.mutate(
        { id: campaignId, data: payload },
        { onSuccess: () => router.push("/client/campaigns") }
      );
    } else {
      createCampaign.mutate(payload, {
        onSuccess: () => router.push("/client/campaigns"),
      });
    }
  }

  /* ---------------- Preview HTML ---------------- */

  /**
   * For the preview we always show: body (from the editor) + template.
   * If no template is selected, we just show the editor content directly.
   */
  const previewHtml = selectedTemplateHtml
    ? mergeBodyWithTemplate(content, selectedTemplateHtml)
    : content;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {mode === "create" ? "Create Campaign" : "Edit Campaign"}
        </h1>
        <p className="text-muted-foreground">
          Write your email content and configure delivery settings
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    Email Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
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

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Body</FormLabel>
                        <FormControl>
                          <RichTextEditor
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

            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Internal name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label>Use Template (Optional)</Label>
                    <TemplateSelector
                      selectedId={selectedTemplateId}
                      onSelect={handleTemplateSelect}
                    />
                  </div>

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
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">Schedule</CardTitle>
                  </div>
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

              <Card className="sticky bottom-6 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-3">
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
                                className="h-4 w-4 rounded border-gray-300"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Send Immediately</FormLabel>
                              <FormDescription>
                                Uncheck to save as draft
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowPreview(true)}
                      disabled={!content}
                    >
                      <Eye className="mr-2 h-4 w-4" /> Preview Email
                    </Button>

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
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting
                          ? "Saving..."
                          : mode === "create"
                          ? "Create"
                          : "Save"}
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
          html={previewHtml}
          subject={subject}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useRouter } from "next/navigation";
// import { Eye, Save, Calendar, FileText } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   FormDescription,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Label } from "@/components/ui/label";

// import { GroupSelector } from "./GroupSelector";
// import { TemplateSelector } from "./TemplateSelector";
// import { RecurringScheduleForm } from "./RecurringScheduleForm";
// import { CampaignPreview } from "./CampaignPreview";
// import { RichTextEditor } from "./RichTextEditor"; // Import the new editor

// import {
//   useCreateCampaign,
//   useUpdateCampaign,
// } from "@/lib/api/hooks/useCampaigns";
// import { Template } from "@/types/entities/template.types";
// import { RecurringFrequency } from "@/types/entities/campaign.types";

// /* ---------------- Schema ---------------- */

// const campaignSchema = z.object({
//   name: z.string().min(1, "Campaign name is required").max(255),
//   subject: z.string().min(1, "Subject is required").max(500),
//   content: z.string().min(1, "Content is required"),
//   groupIds: z.array(z.string()).min(1, "Select at least one recipient group"),

//   // Recurring Schedule
//   isRecurring: z.boolean().default(false),
//   recurringFrequency: z
//     .enum(["NONE", "DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY", "CUSTOM"])
//     .default("NONE"),
//   recurringTime: z.string().optional(),
//   recurringTimezone: z.string().optional(),
//   recurringDaysOfWeek: z.array(z.number().min(0).max(6)).optional(),
//   recurringDayOfMonth: z.number().min(1).max(31).optional(),
//   recurringStartDate: z.string().optional(),
//   recurringEndDate: z.string().optional(),
//   customCronExpression: z.string().optional(),
//   sendImmediately: z.boolean().default(true),
// });

// type CampaignFormValues = z.infer<typeof campaignSchema>;

// interface CampaignFormProps {
//   mode?: "create" | "edit";
//   initialData?: Partial<CampaignFormValues>;
//   campaignId?: string;
// }

// export function CampaignForm({
//   mode = "create",
//   initialData,
//   campaignId,
// }: CampaignFormProps) {
//   const router = useRouter();
//   const [showPreview, setShowPreview] = useState(false);
//   const [selectedTemplateId, setSelectedTemplateId] = useState<
//     string | undefined
//   >();

//   const createCampaign = useCreateCampaign();
//   const updateCampaign = useUpdateCampaign();
//   const isSubmitting = createCampaign.isPending || updateCampaign.isPending;

//   const form = useForm<CampaignFormValues>({
//     resolver: zodResolver(campaignSchema),
//     defaultValues: {
//       name: "",
//       subject: "",
//       content: "",
//       groupIds: [],
//       isRecurring: false,
//       recurringFrequency: "NONE",
//       recurringTime: "09:00",
//       recurringTimezone: "Asia/Kolkata",
//       recurringDaysOfWeek: [],
//       sendImmediately: true,
//       ...initialData,
//     },
//   });

//   const { watch, setValue } = form;
//   const content = watch("content");
//   const subject = watch("subject");
//   const isRecurring = watch("isRecurring");
//   const recurringFrequency = watch("recurringFrequency");

//   /* ---------------- Template Selection ---------------- */

//   const handleTemplateSelect = (template: Template | null) => {
//     if (template) {
//       setSelectedTemplateId(template.id);
//       setValue("subject", template.subject, { shouldValidate: true });
//       setValue("content", template.content, { shouldValidate: true });
//     } else {
//       setSelectedTemplateId(undefined);
//       setValue("content", "", { shouldValidate: false });
//     }
//   };

//   /* ---------------- Schedule Field Updates ---------------- */

//   const handleScheduleChange = (field: string, value: any) => {
//     setValue(field as keyof CampaignFormValues, value, {
//       shouldValidate: true,
//     });
//   };

//   /* ---------------- Submit ---------------- */

//   function onSubmit(data: CampaignFormValues) {
//     const payload = {
//       name: data.name,
//       subject: data.subject,
//       content: data.content,
//       groupIds: data.groupIds,
//       isRecurring: data.isRecurring,
//       ...(data.isRecurring && {
//         recurringFrequency: data.recurringFrequency,
//         recurringTime: data.recurringTime,
//         recurringTimezone: data.recurringTimezone,
//         ...(data.recurringDaysOfWeek?.length && {
//           recurringDaysOfWeek: data.recurringDaysOfWeek,
//         }),
//         ...(data.recurringDayOfMonth && {
//           recurringDayOfMonth: data.recurringDayOfMonth,
//         }),
//         ...(data.recurringStartDate && {
//           recurringStartDate: data.recurringStartDate,
//         }),
//         ...(data.recurringEndDate && {
//           recurringEndDate: data.recurringEndDate,
//         }),
//         ...(data.customCronExpression && {
//           customCronExpression: data.customCronExpression,
//         }),
//       }),
//       ...(!data.isRecurring && { sendImmediately: data.sendImmediately }),
//     };

//     if (mode === "edit" && campaignId) {
//       updateCampaign.mutate(
//         { id: campaignId, data: payload },
//         { onSuccess: () => router.push("/client/campaigns") }
//       );
//     } else {
//       createCampaign.mutate(payload, {
//         onSuccess: () => router.push("/client/campaigns"),
//       });
//     }
//   }

//   return (
//     <div className="max-w-7xl mx-auto">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold tracking-tight">
//           {mode === "create" ? "Create Campaign" : "Edit Campaign"}
//         </h1>
//         <p className="text-muted-foreground">
//           Write your email content and configure delivery settings
//         </p>
//       </div>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)}>
//           <div className="grid lg:grid-cols-3 gap-6">
//             {/* LEFT PANEL - Text Editor */}
//             <div className="lg:col-span-2 space-y-6">
//               <Card>
//                 <CardHeader className="pb-4">
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <FileText className="h-5 w-5 text-muted-foreground" />
//                     Email Content
//                   </CardTitle>
//                   <CardDescription>
//                     Compose your email message using the editor below.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-5">
//                   <FormField
//                     control={form.control}
//                     name="subject"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Email Subject</FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="e.g., 🎉 Don't miss our Summer Sale!"
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="content"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Email Body</FormLabel>
//                         <FormControl>
//                           <RichTextEditor
//                             value={field.value}
//                             onChange={field.onChange}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </CardContent>
//               </Card>
//             </div>

//             {/* RIGHT PANEL - Settings & Actions */}
//             <div className="lg:col-span-1 space-y-6">
//               <Card>
//                 <CardHeader className="pb-4">
//                   <CardTitle className="text-lg">Campaign Details</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-5">
//                   <FormField
//                     control={form.control}
//                     name="name"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Campaign Name</FormLabel>
//                         <FormControl>
//                           <Input placeholder="Internal name" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <div className="space-y-2">
//                     <Label>Use Template (Optional)</Label>
//                     <TemplateSelector
//                       selectedId={selectedTemplateId}
//                       onSelect={handleTemplateSelect}
//                     />
//                   </div>

//                   <FormField
//                     control={form.control}
//                     name="groupIds"
//                     render={({ field, fieldState }) => (
//                       <FormItem>
//                         <FormLabel>Recipients</FormLabel>
//                         <FormControl>
//                           <GroupSelector
//                             selectedIds={field.value}
//                             onChange={field.onChange}
//                             error={fieldState.error?.message}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="pb-4">
//                   <div className="flex items-center gap-2">
//                     <Calendar className="h-5 w-5 text-muted-foreground" />
//                     <CardTitle className="text-lg">Schedule</CardTitle>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <RecurringScheduleForm
//                     isRecurring={isRecurring}
//                     frequency={recurringFrequency as RecurringFrequency}
//                     time={watch("recurringTime")}
//                     timezone={watch("recurringTimezone")}
//                     daysOfWeek={watch("recurringDaysOfWeek")}
//                     dayOfMonth={watch("recurringDayOfMonth")}
//                     startDate={watch("recurringStartDate") ? new Date(watch("recurringStartDate")!) : undefined}
//                     endDate={watch("recurringEndDate") ? new Date(watch("recurringEndDate")!) : undefined}
//                     customCron={watch("customCronExpression")}
//                     onChange={handleScheduleChange}
//                   />
//                 </CardContent>
//               </Card>

//               <Card className="sticky bottom-6">
//                 <CardContent className="pt-6">
//                   <div className="flex flex-col gap-3">
//                     {!isRecurring && (
//                       <FormField
//                         control={form.control}
//                         name="sendImmediately"
//                         render={({ field }) => (
//                           <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
//                             <FormControl>
//                               <input
//                                 type="checkbox"
//                                 checked={field.value}
//                                 onChange={field.onChange}
//                                 className="h-4 w-4 rounded border-gray-300"
//                               />
//                             </FormControl>
//                             <div className="space-y-1 leading-none">
//                               <FormLabel>Send Immediately</FormLabel>
//                               <FormDescription>Uncheck to save as draft</FormDescription>
//                             </div>
//                           </FormItem>
//                         )}
//                       />
//                     )}

//                     <Button
//                       type="button"
//                       variant="outline"
//                       className="w-full"
//                       onClick={() => setShowPreview(true)}
//                       disabled={!content}
//                     >
//                       <Eye className="mr-2 h-4 w-4" /> Preview Email
//                     </Button>

//                     <Separator />

//                     <div className="flex gap-3">
//                       <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
//                         Cancel
//                       </Button>
//                       <Button type="submit" className="flex-1" disabled={isSubmitting}>
//                         <Save className="mr-2 h-4 w-4" />
//                         {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Save"}
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </form>
//       </Form>

//       {showPreview && (
//         <CampaignPreview
//           html={content}
//           customMessage={subject}
//           onClose={() => setShowPreview(false)}
//         />
//       )}
//     </div>
//   );
// }
