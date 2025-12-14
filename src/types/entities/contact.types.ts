export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    isActive: boolean;
    isUnsubscribed: boolean;
    clientId: string;
    customFieldValues?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface CreateContactDTO {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    customFieldValues?: Record<string, any>;
}

export interface UpdateContactDTO {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    isActive?: boolean;
    customFieldValues?: Record<string, any>;
}

export interface BulkImportResult {
    imported: number;
    failed: number;
    errors: Array<{
        row: number;
        email: string;
        message: string;
    }>;
}
