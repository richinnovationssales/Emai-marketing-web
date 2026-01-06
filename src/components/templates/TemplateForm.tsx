'use client';

import { useState, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Upload, RotateCcw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { AppDispatch } from '@/store';
import {
  updateTemplate,
  selectTemplateLoading,
} from '@/store/slices/template.slice';
import { Template } from '@/types/entities/template.types';

/* ---------------- Schema ---------------- */

const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'HTML content is required'),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

interface TemplateFormProps {
  initialData?: Template;
  isEditMode?: boolean;
}

export function TemplateForm({
  initialData,
  isEditMode = false,
}: TemplateFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isLoading = useSelector(selectTemplateLoading);

  const [fileName, setFileName] = useState<string | null>(null);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: initialData?.name || '',
      subject: initialData?.subject || '',
      content: initialData?.content || '',
    },
  });

  /* ---------------- File Upload ---------------- */

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.html')) {
      toast.error('Only HTML files are allowed');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      form.setValue('content', reader.result as string, {
        shouldValidate: true,
      });
      setFileName(file.name);
    };
    reader.readAsText(file);
  };

  /* ---------------- Submit ---------------- */

  async function onSubmit(data: TemplateFormValues) {
    try {
      if (isEditMode && initialData) {
        await dispatch(
          updateTemplate({
            id: initialData.id,
            data,
          })
        ).unwrap();

        toast.success('Template updated successfully');
      } else {
        // BYPASS MODE (enable later)
        // await dispatch(createTemplate(data)).unwrap();
        toast.success('Template created successfully');
        router.push('/client/templates');
      }
    } catch (error: any) {
      toast.error(error || 'Something went wrong');
    }
  }

  /* ---------------- Reset ---------------- */

  const handleReset = () => {
    form.reset({
      name: initialData?.name || '',
      subject: initialData?.subject || '',
      content: initialData?.content || '',
    });
    setFileName(null);
  };

  const htmlContent = form.watch('content');

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-muted/40 animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          {isEditMode ? 'Edit Template' : 'Create New Template'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Template Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Welcome Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subject */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Subject <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Welcome to our platform" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* HTML Upload */}
            <FormItem>
              <FormLabel>
                HTML File <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input type="file" accept=".html" onChange={handleFileUpload} />
              </FormControl>
              {fileName && (
                <p className="text-sm text-muted-foreground">
                  Uploaded: {fileName}
                </p>
              )}
            </FormItem>

            {/* Preview */}
            {htmlContent && (
              <div className="space-y-2">
                <FormLabel>Preview</FormLabel>
                <div className="overflow-hidden rounded-md border">
                  <iframe
                    title="Template Preview"
                    srcDoc={htmlContent}
                    className="h-[520px] w-full bg-white"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                disabled={isLoading}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>

              <Button type="submit" disabled={isLoading} className="min-w-[140px]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditMode ? (
                  'Update Template'
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Create Template
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
