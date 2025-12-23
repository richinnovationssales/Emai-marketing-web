'use client';

import React from 'react';
import { CustomFieldType } from '@/types/enums/custom-field-type.enum';
import { CustomFieldValueWithDefinition } from '@/types/entities/group.types';
import { Mail, Phone, Link as LinkIcon, Calendar, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CustomFieldRendererProps {
  fieldValue: CustomFieldValueWithDefinition;
  className?: string;
}

export default function CustomFieldRenderer({ fieldValue, className }: CustomFieldRendererProps) {
  const { customField, value } = fieldValue;

  if (!value || value === '') {
    return (
      <span className={cn('text-sm text-slate-400 dark:text-slate-600 italic', className)}>
        Not set
      </span>
    );
  }

  const renderValue = () => {
    switch (customField.type) {
      case CustomFieldType.EMAIL:
        return (
          <a
            href={`mailto:${value}`}
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Mail className="h-3.5 w-3.5" />
            {value}
          </a>
        );

      case CustomFieldType.PHONE:
        return (
          <a
            href={`tel:${value}`}
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Phone className="h-3.5 w-3.5" />
            {value}
          </a>
        );

      case CustomFieldType.URL:
        return (
          <a
            href={value.startsWith('http') ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            <LinkIcon className="h-3.5 w-3.5" />
            {value}
          </a>
        );

      case CustomFieldType.DATE:
        try {
          const date = new Date(value);
          return (
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
              <Calendar className="h-3.5 w-3.5" />
              {date.toLocaleDateString()}
            </span>
          );
        } catch {
          return <span className="text-sm text-slate-700 dark:text-slate-300">{value}</span>;
        }

      case CustomFieldType.BOOLEAN:
        const isTrue = value.toLowerCase() === 'true' || value === '1';
        return (
          <span className={cn(
            'inline-flex items-center gap-1.5 text-sm font-medium',
            isTrue ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          )}>
            {isTrue ? (
              <>
                <CheckCircle className="h-3.5 w-3.5" />
                Yes
              </>
            ) : (
              <>
                <XCircle className="h-3.5 w-3.5" />
                No
              </>
            )}
          </span>
        );

      case CustomFieldType.NUMBER:
        return (
          <span className="text-sm font-mono text-slate-700 dark:text-slate-300">
            {value}
          </span>
        );

      case CustomFieldType.TEXTAREA:
        return (
          <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {value.length > 100 ? (
              <details className="cursor-pointer">
                <summary className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline">
                  <FileText className="h-3.5 w-3.5" />
                  Show full text ({value.length} characters)
                </summary>
                <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                  {value}
                </div>
              </details>
            ) : (
              value
            )}
          </div>
        );

      case CustomFieldType.SELECT:
        return (
          <Badge variant="secondary" className="text-xs">
            {value}
          </Badge>
        );

      case CustomFieldType.MULTISELECT:
        try {
          const values = JSON.parse(value);
          if (Array.isArray(values)) {
            return (
              <div className="flex flex-wrap gap-1">
                {values.map((val, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {val}
                  </Badge>
                ))}
              </div>
            );
          }
        } catch {
          // If parsing fails, treat as comma-separated string
          const values = value.split(',').map(v => v.trim());
          return (
            <div className="flex flex-wrap gap-1">
              {values.map((val, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {val}
                </Badge>
              ))}
            </div>
          );
        }
        return <span className="text-sm text-slate-700 dark:text-slate-300">{value}</span>;

      case CustomFieldType.TEXT:
      default:
        return <span className="text-sm text-slate-700 dark:text-slate-300">{value}</span>;
    }
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {customField.name}
      </span>
      {renderValue()}
    </div>
  );
}
