export interface Group {
    id: string;
    name: string;
    description: string | null;
    clientId: string;
    createdAt: string;
    updatedAt: string;
    _count?: {
        contacts: number;
        campaigns: number;
    };
}

export interface CreateGroupDTO {
    name: string;
    description?: string;
    contactIds?: string[];
}

export interface UpdateGroupDTO {
    name?: string;
    description?: string;
}

export interface GroupWithContacts extends Group {
    contacts: Array<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }>;
}

export type CreateGroupData = CreateGroupDTO;
export type UpdateGroupData = UpdateGroupDTO;
