import { EmailEventType } from '../enums/email-event-type.enum';

export interface EmailEvent {
    id: string;
    type: EmailEventType;
    campaignId: string;
    contactId: string;
    metadata: Record<string, any> | null;
    createdAt: string;
}

export interface EmailEventStats {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    spamReported: number;
    unsubscribed: number;
}
