"use client";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  useTemplate,
  useUpdateTemplate,
} from "@/lib/api/hooks/useTemplates";
import { Skeleton } from "@/components/ui/skeleton";

const TemplateEditor = dynamic(
  () => import("@/components/templates/TemplateEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        Loading editor...
      </div>
    ),
  }
);

export default function EditTemplatePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError } = useTemplate(id);
  const updateTemplate = useUpdateTemplate();

  const template = (data?.data ?? data) as
    | { id: string; name: string; subject: string; content: string }
    | undefined;

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] -m-8 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !template) {
    return (
      <div className="h-[calc(100vh-4rem)] -m-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Template not found</h2>
          <p className="text-muted-foreground">
            The template you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const handleSave = (payload: {
    name: string;
    subject: string;
    content: string;
  }) => {
    updateTemplate.mutate(
      { id, data: payload },
      {
        onSuccess: () => router.push("/client/templates"),
      }
    );
  };

  return (
    <div className="h-[calc(100vh-4rem)] -m-8">
      <TemplateEditor
        templateId={id}
        initialName={template.name}
        initialSubject={template.subject}
        initialContent={template.content}
        onSave={handleSave}
        isSaving={updateTemplate.isPending}
      />
    </div>
  );
}
