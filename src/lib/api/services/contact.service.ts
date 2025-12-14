import apiClient from '../client';
import { Contact, CreateContactDTO, UpdateContactDTO, BulkImportResult } from '@/types/entities/contact.types';
import { ApiResponse } from '@/types/api/response.types';

export const contactService = {
    // Get all contacts for a client
    getAll: async (clientId: string): Promise<Contact[]> => {
        const { data } = await apiClient.get<ApiResponse<Contact[]>>('/contacts', {
            params: { clientId },
        });
        return data.data;
    },

    // Get contact by ID
    getById: async (id: string, clientId: string): Promise<Contact> => {
        const { data } = await apiClient.get<ApiResponse<Contact>>(`/contacts/${id}`, {
            params: { clientId },
        });
        return data.data;
    },

    // Create contact
    create: async (contactData: CreateContactDTO, clientId: string): Promise<Contact> => {
        const { data } = await apiClient.post<ApiResponse<Contact>>('/contacts', {
            ...contactData,
            clientId,
        });
        return data.data;
    },

    // Update contact
    update: async (id: string, contactData: UpdateContactDTO, clientId: string): Promise<Contact> => {
        const { data } = await apiClient.put<ApiResponse<Contact>>(`/contacts/${id}`, {
            ...contactData,
            clientId,
        });
        return data.data;
    },

    // Delete contact
    delete: async (id: string, clientId: string): Promise<void> => {
        await apiClient.delete(`/contacts/${id}`, {
            params: { clientId },
        });
    },

    // Bulk import
    bulkImport: async (file: File, clientId: string): Promise<BulkImportResult> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('clientId', clientId);

        const { data } = await apiClient.post<ApiResponse<BulkImportResult>>('/contacts/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data.data;
    },
};
