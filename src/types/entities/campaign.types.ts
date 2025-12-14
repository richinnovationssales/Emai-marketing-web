import { CampaignStatus } from '../enums/campaign-status.enum';

export interface Campaign {
    id: string;
    name: string;
    subject: string;
    content: string;
    status: CampaignStatus;
    isRecurring: boolean;
    recurringSchedule: string | null;
    scheduledDate: string | null;
    sentAt: string | null;
    clientId: string;
    createdById: string;
    templateId: string | null;
    createdAt: string;
    updatedAt: string;
    _count?: {
        groups: number;
        emailEvents: number;
    };
}

export interface CreateCampaignDTO {
    name: string;
    subject: string;
    content: string;
    isRecurring?: boolean;
    recurringSchedule?: string;
    scheduledDate?: string;
    templateId?: string;
    groupIds: string[];
}

export interface UpdateCampaignDTO {
    name?: string;
    subject?: string;
    content?: string;
    isRecurring?: boolean;
    recurringSchedule?: string;
    scheduledDate?: string;
    status?: CampaignStatus;
}

export interface CampaignAnalytics {
    campaignId: string;
    totalSent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    spamReported: number;
    unsubscribed: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
}
