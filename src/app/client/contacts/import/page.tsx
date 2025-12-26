'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, FilePlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ImportPage() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto py-8 px-4">
             <div className="flex items-center gap-4">
                <Link href="/client/contacts">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                   <h1 className="text-3xl font-bold tracking-tight">Import Data</h1>
                   <p className="text-muted-foreground">Choose how you want to add contacts to your audience.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/client/contacts/bulk-upload">
                    <Card className="hover:border-primary/50 transition-all cursor-pointer h-full hover:shadow-md group">
                        <CardHeader className="text-center space-y-4 py-10">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <UploadCloud className="w-8 h-8" />
                            </div>
                            <div>
                                <CardTitle>Upload from File</CardTitle>
                                <CardDescription className="mt-2">Import contacts from a CSV or Excel file. Great for large lists.</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/client/contacts/create">
                    <Card className="hover:border-primary/50 transition-all cursor-pointer h-full hover:shadow-md group">
                        <CardHeader className="text-center space-y-4 py-10">
                            <div className="w-16 h-16 bg-secondary/20 text-secondary-foreground rounded-full flex items-center justify-center mx-auto group-hover:bg-secondary transition-colors">
                                <FilePlus className="w-8 h-8" />
                            </div>
                            <div>
                                <CardTitle>Manually Add Contact</CardTitle>
                                <CardDescription className="mt-2">Fill out a form to add a single contact to your list.</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
