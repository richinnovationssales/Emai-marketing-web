'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchContacts, selectContacts, selectContactLoading, selectNextCursor, deleteContact } from '@/store/slices/contact.slice';
import { ContactsTable } from '@/components/contacts/ContactsTable';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ContactsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const contacts = useSelector(selectContacts);
    const isLoading = useSelector(selectContactLoading);
    const nextCursor = useSelector(selectNextCursor);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        dispatch(fetchContacts({ limit: 20 }));
    }, [dispatch]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this contact?')) return;
        try {
            await dispatch(deleteContact(id)).unwrap();
            toast.success('Contact deleted');
        } catch (error) {
            toast.error('Failed to delete contact');
        }
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto py-6 px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                   <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
                   <p className="text-muted-foreground">Manage your subscriber list and audience.</p>
                </div>
                <div className="flex items-center gap-2">
                     <Link href="/client/contacts/import">
                        <Button variant="outline">
                            <Upload className="mr-2 h-4 w-4" /> Import
                        </Button>
                    </Link>
                    <Link href="/client/contacts/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> New Contact
                        </Button>
                    </Link>
                </div>
            </div>

            {isLoading && contacts.length === 0 ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <ContactsTable data={contacts} onDelete={handleDelete} />
            )}
            
            {/* Simple Load More impl */}
            {nextCursor && !isLoading && (
                 <div className="flex justify-center pt-4">
                    <Button variant="ghost" onClick={() => dispatch(fetchContacts({ cursor: nextCursor, limit: 20 }))}>
                        Load More
                    </Button>
                 </div>
            )}
        </div>
    );
}
