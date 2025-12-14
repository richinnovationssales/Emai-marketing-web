export interface Plan {
    id: string;
    name: string;
    emailLimit: number | null;
    price: number;
    isActive: boolean;
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
    adminUser: {
        email: string;
        password: string;
    };
    customFields?: Array<{
        name: string;
        fieldKey: string;
        type: string;
        isRequired?: boolean;
    }>;
}

export interface UpdateClientDTO {
    name?: string;
    planId?: string;
    isActive?: boolean;
}

export interface ClientAnalytics {
    totalContacts: number;
    activeCampaigns: number;
    // Add other fields as needed based on backend
}

export interface OnboardClientDTO extends CreateClientDTO {
    // Check if there are differences, spec says keys but structure seems similar
    // for now we extend CreateClientDTO
}

export interface ClientWithStats extends Client {
    _count: {
        users: number;
        contacts: number;
        campaigns: number;
        groups: number;
    };
}
