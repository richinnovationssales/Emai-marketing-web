import apiClient from "../client";
import {
  Contact,
  CreateContactDTO,
  UpdateContactDTO,
  BulkImportResult,
  ContactFilters,
} from "@/types/entities/contact.types";
import {
  ApiResponse,
  CursorPaginatedResponse,
} from "@/types/api/response.types";

export const contactService = {
  // Get all contacts (paginated)
  getAll: async (
    params?: ContactFilters,
  ): Promise<CursorPaginatedResponse<Contact>> => {
    const { data } = await apiClient.get<CursorPaginatedResponse<Contact>>(
      "/contacts",
      {
        params,
      },
    );
    return data;
  },

  // Get contact by ID
  getById: async (id: string): Promise<Contact> => {
    const { data } = await apiClient.get<Contact>(`/contacts/${id}`);
    return data;
  },

  // Create contact
  create: async (contactData: CreateContactDTO): Promise<Contact> => {
    const { data } = await apiClient.post<ApiResponse<Contact>>(
      "/contacts",
      contactData,
    );
    return data.data;
  },

  // Update contact
  update: async (
    id: string,
    contactData: UpdateContactDTO,
  ): Promise<Contact> => {
    const { data } = await apiClient.put<ApiResponse<Contact>>(
      `/contacts/${id}`,
      contactData,
    );
    return data.data;
  },

  // Delete contact
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/contacts/${id}`);
  },

  // Bulk upload (was bulkImport)
  bulkUpload: async (
    file: File,
    groupId?: string,
  ): Promise<BulkImportResult> => {
    const formData = new FormData();
    formData.append("file", file);
    if (groupId) {
      formData.append("groupId", groupId);
    }

    const { data } = await apiClient.post<BulkImportResult>(
      "/contacts/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    // Raw body: { total, success, failed, message, warnings?, errors? }
    return data;
  },

  // Excel template built from the client's custom fields
  downloadUploadTemplate: async (): Promise<Blob> => {
    const { data } = await apiClient.get<Blob>("/contacts/upload-template", {
      responseType: "blob",
    });
    return data;
  },

  // Bulk delete contacts
  bulkDelete: async (ids: string[]): Promise<void> => {
    await apiClient.post("/contacts/bulk-delete", { ids });
  },

  // In contact.service.ts
  search: async (params: { q: string; cursor?: string; limit?: number }) => {
    const query = new URLSearchParams({
      q: params.q,
      limit: String(params.limit ?? 20),
      ...(params.cursor && { cursor: params.cursor }),
    });
    const res = await apiClient.get(`/contacts/search?${query}`);
    return res.data as { data: Contact[]; nextCursor: string | null };
  },
};
