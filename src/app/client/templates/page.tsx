'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TemplateTable, Template } from '@/components/templates/TemplateTable';

export default function TemplatesPage() {
  const templates: Template[] = [
    {
      id: '1',
      name: 'Welcome Email',
      subject: 'Welcome to our platform',
      status: 'ACTIVE',
      updatedAt: '2026-01-01',
    },
    {
      id: '2',
      name: 'Password Reset',
      subject: 'Reset your password',
      status: 'DRAFT',
      updatedAt: '2026-01-03',
    },
  ];

  const handleDelete = (id: string) => {
    console.log('Delete template:', id);
  };

  const handleDuplicate = (id: string) => {
    console.log('Duplicate template:', id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Templates
          </h1>
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
          <TemplateTable
            data={templates}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        </CardContent>
      </Card>
    </div>
  );
}
