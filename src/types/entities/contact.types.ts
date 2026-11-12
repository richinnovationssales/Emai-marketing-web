export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    isActive: boolean;
    isUnsubscribed: boolean;
    clientId: string;
    customFieldValues?: Record<string, any>; // Deprecated in favor of customFields? API doc says customFields.
    // reconciling with doc: "customFields?: Record<string, CustomFieldValue>;"
    customFields?: Record<string, any>;
    groupId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateContactDTO {
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    customFields?: Record<string, any>;
    groupId?: string;
}

export interface UpdateContactDTO {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    isActive?: boolean;
    customFields?: Record<string, any>;
    // groupId is NOT updatable via this endpoint per doc
}

export interface BulkImportRowError {
    /** Row number as shown in Excel (header is row 1) */
    row: number;
    email?: string;
    reason: string;
}

export interface BulkImportResult {
    total?: number;
    success: number;
    failed: number;
    message: string;
    warnings?: string[];
    errors?: BulkImportRowError[];
}

export interface ContactFilters {
    cursor?: string;
    limit?: number;
    groupId?: string;
    search?: string;
}


export interface BaseContact {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  createdAt?: string;
  groupId?: string | null;
  groupName?: string | null;

  // Dynamic fields support
  customFields?: Record<string, any>;
}
