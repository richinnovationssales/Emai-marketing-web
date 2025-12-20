export interface Plan {
    id: string;
    name: string;
    emailLimit: number;
    price: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePlanDTO {
    name: string;
    emailLimit: number;
    price: number;
}

export interface UpdatePlanDTO {
    name?: string;
    emailLimit?: number;
    price?: number;
}

export interface PlanWithClientCount extends Plan {
    clientCount?: number;
}

export type CreatePlanData = CreatePlanDTO;
export type UpdatePlanData = UpdatePlanDTO;

