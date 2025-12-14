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

export type CreateTemplateData = CreateTemplateDTO;
export type UpdateTemplateData = UpdateTemplateDTO;
