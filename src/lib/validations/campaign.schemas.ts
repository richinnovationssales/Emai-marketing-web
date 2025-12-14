import { z } from 'zod';

export const campaignSchema = z.object({
    name: z.string().min(1, 'Campaign name is required').max(200),
    subject: z.string().min(1, 'Email subject is required').max(500),
    content: z.string().min(1, 'Email content is required'),
    isRecurring: z.boolean().default(false),
    recurringSchedule: z.string().optional().nullable(),
    scheduledDate: z.string().optional().nullable(),
    templateId: z.string().optional().nullable(),
    groupIds: z.array(z.string()).min(1, 'Please select at least one group'),
});

export const updateCampaignSchema = campaignSchema.partial().omit({ groupIds: true });

export type CampaignInput = z.infer<typeof campaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
