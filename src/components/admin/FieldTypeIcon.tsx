'use client';

import React from 'react';
import { CustomFieldType } from '@/types/entities/client.types';
import { 
    Text, 
    Hash, 
    Mail, 
    Phone, 
    Calendar, 
    ToggleLeft, 
    Link, 
    AlignLeft, 
    List, 
    ListChecks 
} from 'lucide-react';

interface FieldTypeIconProps {
    type: CustomFieldType;
    className?: string;
}

export function FieldTypeIcon({ type, className = "h-4 w-4" }: FieldTypeIconProps) {
    const icons: Record<CustomFieldType, React.ElementType> = {
        [CustomFieldType.TEXT]: Text,
        [CustomFieldType.NUMBER]: Hash,
        [CustomFieldType.EMAIL]: Mail,
        [CustomFieldType.PHONE]: Phone,
        [CustomFieldType.DATE]: Calendar,
        [CustomFieldType.BOOLEAN]: ToggleLeft,
        [CustomFieldType.URL]: Link,
        [CustomFieldType.TEXTAREA]: AlignLeft,
        [CustomFieldType.SELECT]: List,
        [CustomFieldType.MULTISELECT]: ListChecks,
    };

    const Icon = icons[type];
    return <Icon className={className} />;
}
