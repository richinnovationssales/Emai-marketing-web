"use client";

import { useState, useMemo } from "react";
import { Plus, Loader2, Search, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateTable } from "@/components/templates/TemplateTable";
import { useTemplates, useDeleteTemplate } from "@/lib/api/hooks/useTemplates";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { TemplateView } from "@/types/entities/template.types";

export default function TemplatesPage() {
  const { data, isLoading, isError } = useTemplates();
  const deleteTemplate = useDeleteTemplate();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const templates: TemplateView[] = ((data?.data ?? data ?? []) as any[]).map((t) => ({
    ...t,
    isActive: true,
  }));

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q)
    );
  }, [templates, searchQuery]);

  const handleDelete = (id: string) => setDeleteId(id);

  const confirmDelete = () => {
    if (deleteId) {
      deleteTemplate.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handleDuplicate = (id: string) => {
    console.log("Duplicate template:", id);
  };

  const hasTemplates = templates.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
          <p className="text-sm text-muted-foreground">
            Manage and reuse your email templates
          </p>
        </div>

        <Link href="/client/templates/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </Link>
      </div>

      {/* Search — only when data is loaded and non-empty */}
      {!isLoading && hasTemplates && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-muted-foreground">
              Failed to load templates. Please try again.
            </div>
          ) : (
            <TemplateTable
              data={filteredTemplates}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteTemplate.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { Plus, Loader2 } from "lucide-react";
// import Link from "next/link";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { TemplateTable } from "@/components/templates/TemplateTable";
// import { useTemplates, useDeleteTemplate } from "@/lib/api/hooks/useTemplates";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Skeleton } from "@/components/ui/skeleton";
// import { TemplateView } from "@/types/entities/template.types";

// export default function TemplatesPage() {
//   const { data, isLoading, isError } = useTemplates();
//   const deleteTemplate = useDeleteTemplate();
//   const [deleteId, setDeleteId] = useState<string | null>(null);

//   // Map API templates → UI templates
//   const templates: TemplateView[] = ((data?.data ?? data ?? []) as any[]).map((t) => ({
//     ...t,
//     isActive: true, // replace later with real backend logic
//   }));

//   const handleDelete = (id: string) => {
//     setDeleteId(id);
//   };

//   const confirmDelete = () => {
//     if (deleteId) {
//       deleteTemplate.mutate(deleteId);
//       setDeleteId(null);
//     }
//   };

//   const handleDuplicate = (id: string) => {
//     console.log("Duplicate template:", id);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
//           <p className="text-sm text-muted-foreground">
//             Manage and reuse your email templates
//           </p>
//         </div>

//         <Link href="/client/templates/create">
//           <Button>
//             <Plus className="mr-2 h-4 w-4" />
//             Create Template
//           </Button>
//         </Link>
//       </div>

//       {/* Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Email Templates</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <div className="space-y-3">
//               <Skeleton className="h-12 w-full" />
//               <Skeleton className="h-12 w-full" />
//               <Skeleton className="h-12 w-full" />
//             </div>
//           ) : isError ? (
//             <div className="text-center py-8 text-muted-foreground">
//               Failed to load templates. Please try again.
//             </div>
//           ) : (
//             <TemplateTable
//               data={templates}
//               onDelete={handleDelete}
//               onDuplicate={handleDuplicate}
//             />
//           )}
//         </CardContent>
//       </Card>

//       {/* Delete Confirmation */}
//       <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Template</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete this template? This action cannot
//               be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={confirmDelete}
//               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//             >
//               {deleteTemplate.isPending ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 "Delete"
//               )}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }
