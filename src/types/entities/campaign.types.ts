import { CampaignStatus } from '../enums/campaign-status.enum';

// Recurring Frequency Enum
export type RecurringFrequency = 'NONE' | 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'CUSTOM';

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
    clientId: string;
    createdById: string;
    templateId: string | null;
    
    // Recurring Configuration
    isRecurring: boolean;
    recurringSchedule: string | null;          // Auto-generated cron string
    recurringFrequency: RecurringFrequency;
    recurringTime: string | null;              // "HH:mm" format
    recurringTimezone: string | null;          // IANA timezone e.g. "Asia/Kolkata"
    recurringDaysOfWeek: number[];             // [0..6] for Sun-Sat
    recurringDayOfMonth: number | null;        // 1..31
    recurringStartDate: string | null;         // ISO datetime
    recurringEndDate: string | null;           // ISO datetime
    
    // Mailgun fields
    mailgunMessageIds?: string | null;
    mailgunTags?: string[];
    sentAt: string | null;
    scheduledDate: string | null;
    
    // Relations
    createdBy?: UserSummary;
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
    groupIds?: string[];
    
    // Recurring Schedule (optional)
    isRecurring?: boolean;
    recurringFrequency?: RecurringFrequency;
    recurringTime?: string;
    recurringTimezone?: string;
    recurringDaysOfWeek?: number[];
    recurringDayOfMonth?: number;
    recurringStartDate?: string;
    recurringEndDate?: string;
    customCronExpression?: string;
}

export interface UpdateCampaignDTO {
    name?: string;
    subject?: string;
    content?: string;
    groupIds?: string[];
    
    // Recurring Schedule (optional)
    isRecurring?: boolean;
    recurringFrequency?: RecurringFrequency;
    recurringTime?: string;
    recurringTimezone?: string;
    recurringDaysOfWeek?: number[];
    recurringDayOfMonth?: number;
    recurringStartDate?: string;
    recurringEndDate?: string;
    customCronExpression?: string;
}

export interface UpdateRecurringScheduleDTO {
    isRecurring: boolean;
    recurringFrequency?: RecurringFrequency;
    recurringTime?: string;
    recurringTimezone?: string;
    recurringDaysOfWeek?: number[];
    recurringDayOfMonth?: number;
    recurringStartDate?: string;
    recurringEndDate?: string;
    customCronExpression?: string;
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
