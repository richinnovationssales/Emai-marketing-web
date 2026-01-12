"use client";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useTemplate, useUpdateTemplate } from "@/lib/api/hooks/useTemplates";
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
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const {
    data: templateResponse,
    isLoading,
    isError,
  } = useTemplate(templateId);
  const updateTemplate = useUpdateTemplate();

  const template = templateResponse?.data;

  const handleSave = (data: {
    name: string;
    subject: string;
    content: string;
  }) => {
    updateTemplate.mutate(
      { id: templateId, data },
      {
        onSuccess: () => {
          router.push("/client/templates");
        },
      }
    );
  };

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
            The template you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] -m-8">
      <TemplateEditor
        templateId={templateId}
        initialName={template.name}
        initialSubject={template.subject}
        initialContent={template.content}
        onSave={handleSave}
        isSaving={updateTemplate.isPending}
      />
    </div>
  );
}
