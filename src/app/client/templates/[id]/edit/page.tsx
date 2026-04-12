"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTemplate } from "@/lib/api/hooks/useTemplates";
import { TemplateForm } from "@/components/templates/TemplateForm";

export default function EditTemplatePage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useTemplate(id);

  const template = (data?.data ?? data) as any;

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !template) {
    return (
      <div className="text-center py-16 text-destructive">
        Failed to load template.{" "}
        <Link href="/client/templates" className="underline text-sm">
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/client/templates">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Template</h1>
          <p className="text-sm text-muted-foreground">
            Update &quot;{template?.name ?? "Untitled"}&quot;
          </p>
        </div>
      </div>

      <TemplateForm
        initialData={template}
        isEditMode={true}
      />
    </div>
  );
}
// "use client";

// import { useParams, useRouter } from "next/navigation";
// import dynamic from "next/dynamic";
// import { useTemplate, useUpdateTemplate } from "@/lib/api/hooks/useTemplates";
// import { Skeleton } from "@/components/ui/skeleton";

// const TemplateEditor = dynamic(
//   () => import("@/components/templates/TemplateEditor"),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="flex h-full w-full items-center justify-center">
//         Loading editor...
//       </div>
//     ),
//   }
// );

// export default function EditTemplatePage() {
//   const params = useParams();
//   const router = useRouter();
//   const templateId = params.id as string;

//   const {
//     data: templateResponse,
//     isLoading,
//     isError,
//   } = useTemplate(templateId);
//   const updateTemplate = useUpdateTemplate();

//   const template = templateResponse?.data;

//   const handleSave = (data: {
//     name: string;
//     subject: string;
//     content: string;
//   }) => {
//     updateTemplate.mutate(
//       { id: templateId, data },
//       {
//         onSuccess: () => {
//           router.push("/client/templates");
//         },
//       }
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="h-[calc(100vh-4rem)] -m-8 flex items-center justify-center">
//         <div className="space-y-4 w-full max-w-md">
//           <Skeleton className="h-8 w-3/4" />
//           <Skeleton className="h-4 w-1/2" />
//           <Skeleton className="h-96 w-full" />
//         </div>
//       </div>
//     );
//   }

//   if (isError || !template) {
//     return (
//       <div className="h-[calc(100vh-4rem)] -m-8 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-xl font-semibold mb-2">Template not found</h2>
//           <p className="text-muted-foreground">
//             The template you're looking for doesn't exist.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-[calc(100vh-4rem)] -m-8">
//       <TemplateEditor
//         templateId={templateId}
//         initialName={template.name}
//         initialSubject={template.subject}
//         initialContent={template.content}
//         onSave={handleSave}
//         isSaving={updateTemplate.isPending}
//       />
//     </div>
//   );
// }
