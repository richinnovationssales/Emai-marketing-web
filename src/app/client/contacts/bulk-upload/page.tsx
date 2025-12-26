'use client';

import { BulkUpload } from '@/components/contacts/BulkUpload';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BulkUploadPage() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto py-8 px-4">
             <div className="flex items-center gap-4">
                <Link href="/client/contacts">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Import Contacts</h1>
                    <p className="text-muted-foreground">Upload your contacts from a CSV or Excel file.</p>
                </div>
            </div>

            <BulkUpload />
        </div>
    );
}
