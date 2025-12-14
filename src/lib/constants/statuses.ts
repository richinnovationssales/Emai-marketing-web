import { CampaignStatus } from '@/types/enums/campaign-status.enum';
import { RequestStatus } from '@/types/enums/request-status.enum';
import { CustomFieldType } from '@/types/enums/custom-field-type.enum';
import { EmailEventType } from '@/types/enums/email-event-type.enum';

export const CAMPAIGN_STATUSES = {
    DRAFT: CampaignStatus.DRAFT,
    PENDING_APPROVAL: CampaignStatus.PENDING_APPROVAL,
    APPROVED: CampaignStatus.APPROVED,
    SENDING: CampaignStatus.SENDING,
    SENT: CampaignStatus.SENT,
    FAILED: CampaignStatus.FAILED,
    CANCELLED: CampaignStatus.CANCELLED,
} as const;

export const REQUEST_STATUSES = {
    PENDING: RequestStatus.PENDING,
    APPROVED: RequestStatus.APPROVED,
    REJECTED: RequestStatus.REJECTED,
} as const;

export const CUSTOM_FIELD_TYPES = {
    TEXT: CustomFieldType.TEXT,
    NUMBER: CustomFieldType.NUMBER,
    EMAIL: CustomFieldType.EMAIL,
    PHONE: CustomFieldType.PHONE,
    DATE: CustomFieldType.DATE,
    BOOLEAN: CustomFieldType.BOOLEAN,
    URL: CustomFieldType.URL,
} as const;

export const EMAIL_EVENT_TYPES = {
    SENT: EmailEventType.SENT,
    DELIVERED: EmailEventType.DELIVERED,
    OPENED: EmailEventType.OPENED,
    CLICKED: EmailEventType.CLICKED,
    BOUNCED: EmailEventType.BOUNCED,
    SPAM_REPORTED: EmailEventType.SPAM_REPORTED,
    UNSUBSCRIBED: EmailEventType.UNSUBSCRIBED,
} as const;
