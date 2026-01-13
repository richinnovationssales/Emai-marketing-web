// API model (matches backend exactly)
export interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  clientId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

// UI/View model (derived fields live here)
export interface TemplateView extends Template {
  isActive: boolean;
}

// DTOs
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
  search?: string;
  isActive?: boolean;
  createdById?: string;
  cursor?: string;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export type CreateTemplateData = CreateTemplateDTO;
export type UpdateTemplateData = UpdateTemplateDTO;
