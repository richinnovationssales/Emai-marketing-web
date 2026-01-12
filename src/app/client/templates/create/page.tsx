"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useCreateTemplate } from "@/lib/api/hooks/useTemplates";

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

export default function CreateTemplatePage() {
  const router = useRouter();
  const createTemplate = useCreateTemplate();

  const handleSave = (data: {
    name: string;
    subject: string;
    content: string;
  }) => {
    createTemplate.mutate(data, {
      onSuccess: () => {
        router.push("/client/templates");
      },
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)] -m-8">
      <TemplateEditor onSave={handleSave} isSaving={createTemplate.isPending} />
    </div>
  );
}
