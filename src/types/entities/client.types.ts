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

export enum UserRole {
    CLIENT_SUPER_ADMIN = "CLIENT_SUPER_ADMIN",
    CLIENT_ADMIN = "CLIENT_ADMIN",
    CLIENT_USER = "CLIENT_USER"
}

export interface CustomFieldDefinition {
    name: string;
    fieldKey: string;
    type: CustomFieldType;
    isRequired?: boolean;
    defaultValue?: string;
    options?: string; // JSON string array for SELECT/MULTISELECT
    validationRegex?: string;
    helpText?: string;
    displayOrder?: number;
}

export interface CustomField {
    id: string;
    clientId: string;
    name: string;
    fieldKey: string;
    type: CustomFieldType;
    isRequired: boolean;
    defaultValue: string | null;
    options: string | null; // JSON string array for SELECT/MULTISELECT
    validationRegex: string | null;
    helpText: string | null;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Plan {
    id: string;
    name: string;
    emailLimit: number;
    price: number;
    createdAt: string;
    updatedAt: string;
}

export interface UserSanitized {
    id: string;
    email: string;
    role: UserRole;
    clientId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Contact {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    clientId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Group {
    id: string;
    name: string;
    clientId: string;
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
    // Mailgun domain configuration fields
    registrationEmail: string | null;
    mailgunDomain: string | null;
    mailgunFromEmail: string | null;
    mailgunFromName: string | null;
    mailgunVerified: boolean;
    mailgunVerifiedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ClientDetails extends Client {
    users: UserSanitized[];
    usersCount: number;
    contacts: Contact[];
    contactsCount: number;
    groups: Group[];
    groupsCount: number;
    customFields: CustomField[];
    customFieldsCount: number;
}

export interface CreateClientDTO {
    name: string;
    planId: string;
    adminEmail: string;
    adminPassword: string;
    mailgunDomain?: string; // Optional: Mailgun domain for sending emails
    mailgunFromEmail?: string; // Optional: From email for campaigns (domain must match mailgunDomain)
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
