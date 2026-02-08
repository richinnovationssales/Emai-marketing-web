import apiClient from '../client';
import { Contact, CreateContactDTO, UpdateContactDTO, BulkImportResult, ContactFilters } from '@/types/entities/contact.types';
import { ApiResponse, CursorPaginatedResponse } from '@/types/api/response.types';

export const contactService = {
    // Get all contacts (paginated)
    getAll: async (params?: ContactFilters): Promise<CursorPaginatedResponse<Contact>> => {
        const { data } = await apiClient.get<CursorPaginatedResponse<Contact>>('/contacts', {
            params,
        });
        return data;
    },

    // Get contact by ID
    getById: async (id: string): Promise<Contact> => {
        const { data } = await apiClient.get<Contact>(`/contacts/${id}`);
        return data;
    },

    // Create contact
    create: async (contactData: CreateContactDTO): Promise<Contact> => {
        const { data } = await apiClient.post<ApiResponse<Contact>>('/contacts', contactData);
        return data.data;
    },

    // Update contact
    update: async (id: string, contactData: UpdateContactDTO): Promise<Contact> => {
        const { data } = await apiClient.put<ApiResponse<Contact>>(`/contacts/${id}`, contactData);
        return data.data;
    },

    // Delete contact
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/contacts/${id}`);
    },

    // Bulk upload (was bulkImport)
    bulkUpload: async (file: File, groupId?: string): Promise<BulkImportResult> => {
        const formData = new FormData();
        formData.append('file', file);
        if (groupId) {
            formData.append('groupId', groupId);
        }

        const { data } = await apiClient.post<BulkImportResult>('/contacts/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        // API doc says it returns simple JSON, not always wrapped in "data" or "success".
        // But doc example says: { "success": 42, "failed": 3, "message": "..." }
        // If the backend wraps it in standard ApiResponse, we'd need data.data.
        // Assuming the doc shows the raw response body.
        return data;
    },


    // Bulk delete contacts
    bulkDelete: async (ids: string[]): Promise<void> => {
        await apiClient.post('/contacts/bulk-delete', { ids });
    },
};
