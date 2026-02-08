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

export interface BulkImportResult {
    success: number;
    failed: number;
    message: string;
    // API doc says: { "success": 42, "failed": 3, "message": "..." }
    // Previous type had "imported" and "errors" array. API doc v2 is simpler?
    // Doc says: "Rows that fail validation are skipped... response tells you how many succeeded vs. failed."
    // Let's stick to the v2 doc.
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
