'use client';

import { useState, ChangeEvent } from 'react';
import { Upload, RotateCcw, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function CreateTemplatePage() {
  const [templateName, setTemplateName] = useState('');
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle HTML file upload
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.html')) {
      toast.error('Only HTML files are allowed');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      setHtmlContent(reader.result as string);
      setFileName(file.name);
      setIsUploading(false);
    };

    reader.onerror = () => {
      toast.error('Failed to read file');
      setIsUploading(false);
    };

    reader.readAsText(file);
  };

  // Reset form
  const handleReset = () => {
    setTemplateName('');
    setHtmlContent(null);
    setFileName(null);
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!templateName || !htmlContent) {
      toast.error('Template name and HTML file are required');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: API call
      console.log({ templateName, htmlContent });

      toast.success('Template created successfully');
      handleReset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Create Template
        </h1>
        <p className="text-sm text-muted-foreground">
          Upload an HTML email template and preview it before saving
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Template Name */}
          <div className="space-y-2">
            <Label htmlFor="templateName">Template Name</Label>
            <Input
              id="templateName"
              placeholder="e.g. Welcome Email"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="htmlFile">HTML File</Label>
            <Input
              id="htmlFile"
              type="file"
              accept=".html"
              onChange={handleFileUpload}
              disabled={isUploading || isSubmitting}
            />

            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Reading file…
              </div>
            )}

            {fileName && !isUploading && (
              <p className="text-sm text-muted-foreground">
                Uploaded: {fileName}
              </p>
            )}
          </div>

          {/* Preview */}
          {htmlContent && !isUploading && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="overflow-hidden rounded-md border">
                <iframe
                  title="HTML Preview"
                  srcDoc={htmlContent}
                  className="h-[520px] w-full bg-white"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={handleReset}
              disabled={isUploading || isSubmitting}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isUploading || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Create Template
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
