export enum CustomFieldType {
    TEXT = "TEXT",
    NUMBER = "NUMBER",
    EMAIL = "EMAIL",
    PHONE = "PHONE",
    DATE = "DATE",
    BOOLEAN = "BOOLEAN",
    URL = "URL",
    TEXTAREA = "TEXTAREA",
    SELECT = "SELECT",
    MULTISELECT = "MULTISELECT"
}

export interface CustomFieldDefinition {
    name: string;
    fieldKey: string;
    type: CustomFieldType;
    isRequired?: boolean;
    defaultValue?: string;
    options?: string;
    validationRegex?: string;
    helpText?: string;
    displayOrder?: number;
}

export interface Plan {
    id: string;
    name: string;
    emailLimit: number;
    price: number;
    createdAt: string;
    updatedAt: string;
}

export interface Client {
    id: string;
    name: string;
    isApproved: boolean;
    isActive: boolean;
    plan: Plan;
    planId: string;
    planStartDate: string | null;
    planRenewalDate: string | null;
    remainingMessages: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateClientDTO {
    name: string;
    planId: string;
    adminEmail: string;
    adminPassword: string;
    customFields?: CustomFieldDefinition[];
}

export interface UpdateClientDTO {
    name?: string;
    planId?: string;
    planStartDate?: string;
    planRenewalDate?: string;
    remainingMessages?: number;
    isApproved?: boolean;
    isActive?: boolean;
}

export interface ClientAnalytics {
    totalEmailsSent?: number;
    campaignsScheduled?: number;
    campaignsSent?: number;
    planName?: string;
    remainingMessages?: number;
}

export interface OnboardClientDTO {
    name: string;
    planId: string;
}

export interface ClientWithStats extends Client {
    _count: {
        users: number;
        contacts: number;
        campaigns: number;
        groups: number;
    };
}
