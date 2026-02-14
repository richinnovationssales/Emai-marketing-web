import { CustomFieldType } from '../enums/custom-field-type.enum';

export interface Group {
  id: string;
  name: string;
  description?: string | null;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    contactGroups: number;
  };

  createdBy?: {
    id: string;
    email: string;
    role: string;
    contacts?: Contact[];
  };
}



export interface Contact {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  clientId: string;
  createdAt: string;
  updatedAt: string;
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

// API Response Types matching documentation
export interface CustomFieldDefinition {
    id: string;
    clientId: string;
    name: string;
    fieldKey: string;
    type: CustomFieldType;
    isRequired: boolean;
    defaultValue: string | null;
    options: string | null;
    validationRegex: string | null;
    helpText: string | null;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CustomFieldValueWithDefinition {
    id: string;
    contactId: string;
    customFieldId: string;
    value: string;
    createdAt: string;
    updatedAt: string;
    customField: CustomFieldDefinition;
}

export interface ContactWithCustomFields {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    clientId: string;
    createdAt: string;
    updatedAt: string;
    customFieldValues: CustomFieldValueWithDefinition[];
}

export interface ContactGroupWithDetails {
    contactId: string;
    groupId: string;
    assignedAt: string;
    contact: ContactWithCustomFields;
}

export interface GroupWithContactsResponse {
    id: string;
    name: string;
    clientId: string;
    createdAt: string;
    updatedAt: string;
    contactGroups: ContactGroupWithDetails[];
}

export type CreateGroupData = CreateGroupDTO;
export type UpdateGroupData = UpdateGroupDTO;
