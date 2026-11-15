// Must match the backend Prisma EmailEventType enum exactly.
// Mailgun "unsubscribed" is stored as COMPLAINED; FAILED is counted in totalBounced.
export enum EmailEventType {
    SENT = 'SENT',
    DELIVERED = 'DELIVERED',
    OPENED = 'OPENED',
    CLICKED = 'CLICKED',
    BOUNCED = 'BOUNCED',
    FAILED = 'FAILED',
    COMPLAINED = 'COMPLAINED',
}

export const EmailEventTypeLabels: Record<EmailEventType, string> = {
    [EmailEventType.SENT]: 'Sent',
    [EmailEventType.DELIVERED]: 'Delivered',
    [EmailEventType.OPENED]: 'Opened',
    [EmailEventType.CLICKED]: 'Clicked',
    [EmailEventType.BOUNCED]: 'Bounced',
    [EmailEventType.FAILED]: 'Failed',
    [EmailEventType.COMPLAINED]: 'Complained / Unsubscribed',
};
