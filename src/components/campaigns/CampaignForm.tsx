'use client';

import { useState, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, Eye } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import DateRangePicker from '../shared/DateRangePicker';
import { CampaignEditor } from './CampaignEditor';
import { CampaignPreview } from './CampaignPreview';

/* ---------------- Schema ---------------- */

const campaignSchema = z
  .object({
    sender: z.string().min(1, 'Sender is required'),
    recipient: z.string().min(1, 'Recipient is required'),
    name: z.string().min(1, 'Campaign name is required'),
    templateId: z.string().min(1, 'Template is required'),
    startDate: z.date(),
    endDate: z.date(),
    frequency: z.enum(['DAILY', 'CUSTOM']),
    customDates: z.string().optional(),
    messageHtml: z.string().min(1, 'HTML message is required'),
    customMessage: z.string().min(1, 'Custom message is required'),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

type CampaignFormValues = z.infer<typeof campaignSchema>;

export function CampaignForm() {
  const [htmlFileName, setHtmlFileName] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      frequency: 'DAILY',
    },
  });

  const frequency = form.watch('frequency');
  const messageHtml = form.watch('messageHtml');
  const customMessage = form.watch('customMessage');

  /* ---------------- HTML Upload ---------------- */

  const handleHtmlUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.html')) {
      toast.error('Only HTML files are allowed');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      form.setValue('messageHtml', reader.result as string, {
        shouldValidate: true,
      });
      setHtmlFileName(file.name);
    };
    reader.readAsText(file);
  };

  /* ---------------- Submit ---------------- */

  function onSubmit(data: CampaignFormValues) {
    console.log('Campaign Payload:', data);
    toast.success('Campaign created (UI only)');
  }

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Create Campaign
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Sender & Recipient */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="sender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender</FormLabel>
                    <FormControl>
                      <Input placeholder="no-reply@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient</FormLabel>
                    <FormControl>
                      <Input placeholder="All Users / Group" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Campaign Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="New Product Launch" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Template */}
            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Welcome Template</SelectItem>
                      <SelectItem value="2">Promo Template</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DateRangePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <DateRangePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Frequency */}
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Frequency</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="CUSTOM">Custom Dates</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {frequency === 'CUSTOM' && (
              <FormField
                control={form.control}
                name="customDates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Dates</FormLabel>
                    <FormControl>
                      <Input placeholder="YYYY-MM-DD, YYYY-MM-DD" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {/* HTML Upload */}
            <FormField
              control={form.control}
              name="messageHtml"
              render={() => (
                <FormItem>
                  <FormLabel>Message HTML</FormLabel>
                  <FormControl>
                    <Input type="file" accept=".html" onChange={handleHtmlUpload} />
                  </FormControl>
                  {htmlFileName && (
                    <p className="text-sm text-muted-foreground">
                      Uploaded: {htmlFileName}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Custom Greeting */}
            <FormField
              control={form.control}
              name="customMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Custom Greeting & Message</FormLabel>
                  <FormControl>
                    <CampaignEditor value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview */}
            {(messageHtml || customMessage) && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview Campaign
              </Button>
            )}

            <Button type="submit" className="w-full">
              Create Campaign
            </Button>
          </form>
        </Form>
      </CardContent>

      {showPreview && (
        <CampaignPreview
          html={messageHtml}
          customMessage={customMessage}
          onClose={() => setShowPreview(false)}
        />
      )}
    </Card>
  );
}
