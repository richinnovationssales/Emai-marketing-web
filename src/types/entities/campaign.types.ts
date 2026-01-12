import { CampaignStatus } from '../enums/campaign-status.enum';

export interface UserSummary {
    id: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

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
    mailgunMessageIds?: string | null;  // JSON array of Mailgun IDs
    mailgunTags?: string[];              // Mailgun tags
    createdBy?: UserSummary;             // User who created the campaign
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
    recurringSchedule?: string | null;
    groups?: { id: string }[];  // Array of group objects with IDs
}

export interface UpdateCampaignDTO {
    name?: string;
    subject?: string;
    content?: string;
    isRecurring?: boolean;
    recurringSchedule?: string | null;
    groups?: { id: string }[];  // Array of group objects with IDs
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
