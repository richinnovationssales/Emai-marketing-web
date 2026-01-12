"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
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

export default function TemplatesPage() {
  const { data, isLoading, isError } = useTemplates();
  const deleteTemplate = useDeleteTemplate();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const templates = data?.data || [];

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteTemplate.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handleDuplicate = (id: string) => {
    console.log("Duplicate template:", id);
    // TODO: Implement duplicate functionality
  };

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
              data={templates}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot
              be undone.
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
