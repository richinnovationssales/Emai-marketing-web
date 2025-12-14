export interface Plan {
    id: string;
    name: string;
    emailLimit: number | null;
    price: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePlanDTO {
    name: string;
    emailLimit: number | null;
    price: number;
}

export interface UpdatePlanDTO {
    name?: string;
    emailLimit?: number | null;
    price?: number;
    isActive?: boolean;
}

export type CreatePlanData = CreatePlanDTO;
export type UpdatePlanData = UpdatePlanDTO;
