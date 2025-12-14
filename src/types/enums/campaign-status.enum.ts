export enum CampaignStatus {
    DRAFT = 'DRAFT',
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    APPROVED = 'APPROVED',
    SENDING = 'SENDING',
    SENT = 'SENT',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
}

export const CampaignStatusLabels: Record<CampaignStatus, string> = {
    [CampaignStatus.DRAFT]: 'Draft',
    [CampaignStatus.PENDING_APPROVAL]: 'Pending Approval',
    [CampaignStatus.APPROVED]: 'Approved',
    [CampaignStatus.SENDING]: 'Sending',
    [CampaignStatus.SENT]: 'Sent',
    [CampaignStatus.FAILED]: 'Failed',
    [CampaignStatus.CANCELLED]: 'Cancelled',
};

export const CampaignStatusColors: Record<CampaignStatus, string> = {
    [CampaignStatus.DRAFT]: 'bg-gray-500',
    [CampaignStatus.PENDING_APPROVAL]: 'bg-yellow-500',
    [CampaignStatus.APPROVED]: 'bg-green-500',
    [CampaignStatus.SENDING]: 'bg-blue-500',
    [CampaignStatus.SENT]: 'bg-green-600',
    [CampaignStatus.FAILED]: 'bg-red-500',
    [CampaignStatus.CANCELLED]: 'bg-gray-600',
};
