export enum EmailEventType {
    SENT = 'SENT',
    DELIVERED = 'DELIVERED',
    OPENED = 'OPENED',
    CLICKED = 'CLICKED',
    BOUNCED = 'BOUNCED',
    SPAM_REPORTED = 'SPAM_REPORTED',
    UNSUBSCRIBED = 'UNSUBSCRIBED',
}

export const EmailEventTypeLabels: Record<EmailEventType, string> = {
    [EmailEventType.SENT]: 'Sent',
    [EmailEventType.DELIVERED]: 'Delivered',
    [EmailEventType.OPENED]: 'Opened',
    [EmailEventType.CLICKED]: 'Clicked',
    [EmailEventType.BOUNCED]: 'Bounced',
    [EmailEventType.SPAM_REPORTED]: 'Spam Reported',
    [EmailEventType.UNSUBSCRIBED]: 'Unsubscribed',
};
