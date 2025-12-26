'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchContactById } from '@/store/slices/contact.slice';
// We need a selector for selectedContact. I created setSelectedContact and slice has selectedContact.
// Selector: selectContacts... wait, did I export selectSelectedContact?
// Let me check contact.slice.ts
import { ContactForm } from '@/components/contacts/ContactForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function EditContactPage() {
    const dispatch = useDispatch<AppDispatch>();
    const params = useParams();
    const id = params?.id as string;
    
    // I need to define/export this selector if I haven't.
    // selectSelectedContact
    const selectedContact = useSelector((state: any) => state.contacts.selectedContact); 
    const isLoading = useSelector((state: any) => state.contacts.isLoading);

    useEffect(() => {
        if (id) {
            dispatch(fetchContactById(id));
        }
    }, [dispatch, id]);

    if (isLoading && !selectedContact) {
        return (
             <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto py-8 px-4">
             <div className="flex items-center gap-4">
                <Link href="/client/contacts">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Contact</h1>
                    <p className="text-muted-foreground">Update contact details and custom fields.</p>
                </div>
            </div>
            
            {selectedContact && (
                <ContactForm initialData={selectedContact} isEditMode={true} />
            )}
        </div>
    );
}
