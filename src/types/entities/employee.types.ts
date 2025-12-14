export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    isVerified: boolean;
    isActive: boolean;
    clientId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEmployeeDTO {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}

export interface UpdateEmployeeDTO {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    isActive?: boolean;
}

export interface InviteEmployeeDTO {
    email: string;
    firstName: string;
    lastName: string;
}
