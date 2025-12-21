'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CustomFieldType } from '@/types/entities/client.types';
import { FieldTypeIcon } from './FieldTypeIcon';

interface FieldTypeBadgeProps {
    type: CustomFieldType;
}

export function FieldTypeBadge({ type }: FieldTypeBadgeProps) {
    return (
        <Badge variant="outline" className="flex items-center gap-1 w-fit">
            <FieldTypeIcon type={type} className="h-3 w-3" />
            <span className="text-xs">{type}</span>
        </Badge>
    );
}
