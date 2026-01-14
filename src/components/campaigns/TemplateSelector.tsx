"use client";

import { useTemplates } from "@/lib/api/hooks/useTemplates";
import { Template } from "@/types/entities/template.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";

interface TemplateSelectorProps {
  selectedId?: string;
  onSelect: (template: Template | null) => void;
  disabled?: boolean;
}

export function TemplateSelector({
  selectedId,
  onSelect,
  disabled,
}: TemplateSelectorProps) {
  const { data: templatesResponse, isLoading } = useTemplates();

  // Handle both direct array response and PaginatedResponse format
  const templates: Template[] = Array.isArray(templatesResponse)
    ? templatesResponse
    : templatesResponse?.data || [];

  const handleValueChange = (value: string) => {
    if (value === "none") {
      onSelect(null);
      return;
    }
    const template = templates.find((t) => t.id === value);
    if (template) {
      onSelect(template);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (templates.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-center">
        <FileText className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
        <p className="text-sm text-muted-foreground">
          No templates available. You can still write content manually.
        </p>
      </div>
    );
  }

  return (
    <Select
      value={selectedId || "none"}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a template (optional)" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">
          <span className="text-muted-foreground">
            No template - Write from scratch
          </span>
        </SelectItem>
        {templates.map((template) => (
          <SelectItem key={template.id} value={template.id}>
            <div className="flex flex-col">
              <span className="font-medium">{template.name}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                {template.subject}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default TemplateSelector;
