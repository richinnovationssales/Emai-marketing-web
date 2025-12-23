export enum CustomFieldType {
    TEXT = 'TEXT',
    NUMBER = 'NUMBER',
    EMAIL = 'EMAIL',
    PHONE = 'PHONE',
    DATE = 'DATE',
    BOOLEAN = 'BOOLEAN',
    URL = 'URL',
    TEXTAREA = 'TEXTAREA',
    SELECT = 'SELECT',
    MULTISELECT = 'MULTISELECT',
}

export const CustomFieldTypeLabels: Record<CustomFieldType, string> = {
    [CustomFieldType.TEXT]: 'Text',
    [CustomFieldType.NUMBER]: 'Number',
    [CustomFieldType.EMAIL]: 'Email',
    [CustomFieldType.PHONE]: 'Phone',
    [CustomFieldType.DATE]: 'Date',
    [CustomFieldType.BOOLEAN]: 'Boolean',
    [CustomFieldType.URL]: 'URL',
    [CustomFieldType.TEXTAREA]: 'Text Area',
    [CustomFieldType.SELECT]: 'Select',
    [CustomFieldType.MULTISELECT]: 'Multi-Select',
};
