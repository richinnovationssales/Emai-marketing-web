'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { AppDispatch } from '@/store';
import { fetchTemplateById } from '@/store/slices/template.slice';
import { Button } from '@/components/ui/button';
import { TemplateForm } from '@/components/templates/TemplateForm';

export default function EditTemplatePage() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const id = params?.id as string;

  const selectedTemplate = useSelector(
    (state: any) => state.templates.selectedTemplate
  );
  const isLoading = useSelector(
    (state: any) => state.templates.isLoading
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchTemplateById(id));
    }
  }, [dispatch, id]);

  if (isLoading && !selectedTemplate) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4">
        <Link href="/client/templates">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Template</h1>
          <p className="text-muted-foreground">
            Update template name and HTML content.
          </p>
        </div>
      </div>

      {selectedTemplate && (
        <TemplateForm initialData={selectedTemplate} isEditMode />
      )}
    </div>
  );
}
