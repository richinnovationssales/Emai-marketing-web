import { CustomFieldType } from '../enums/custom-field-type.enum';
import { RequestStatus } from '../enums/request-status.enum';

export interface CustomField {
    id: string;
    name: string;
    fieldKey: string;
    type: CustomFieldType;
    isRequired: boolean;
    isActive: boolean;
    clientId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCustomFieldDTO {
    name: string;
    fieldKey: string;
    type: CustomFieldType;
    isRequired?: boolean;
}

export interface UpdateCustomFieldDTO {
    name?: string;
    isRequired?: boolean;
    isActive?: boolean;
}

export interface CustomFieldRequest {
    id: string;
    fieldName: string;
    fieldKey: string;
    fieldType: CustomFieldType;
    isRequired: boolean;
    status: RequestStatus;
    clientId: string;
    requestedById: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCustomFieldRequestDTO {
    fieldName: string;
    fieldKey: string;
    fieldType: CustomFieldType;
    isRequired?: boolean;
}

export type CreateCustomFieldData = CreateCustomFieldDTO;
export type UpdateCustomFieldData = UpdateCustomFieldDTO;
