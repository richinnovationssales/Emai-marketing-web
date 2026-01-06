export interface Template {
    id: string;
    name: string;
    subject: string;
    content: string;
    isActive: boolean;
    clientId: string;
    createdById: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTemplateDTO {
    name: string;
    subject: string;
    content: string;
}

export interface UpdateTemplateDTO {
    name?: string;
    subject?: string;
    content?: string;
    isActive?: boolean;
}

export interface TemplateFilters {
  search?: string;        // Search by name / subject
  isActive?: boolean;     // Active / inactive templates
  createdById?: string;   // Filter by creator
  cursor?: string;        // Pagination cursor
  limit?: number;         // Page size
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export type CreateTemplateData = CreateTemplateDTO;
export type UpdateTemplateData = UpdateTemplateDTO;
