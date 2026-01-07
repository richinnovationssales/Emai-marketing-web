'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchContactById, setSelectedContact, selectContactError } from '@/store/slices/contact.slice';
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
    const error = useSelector((state: any) => state.contacts.error) || useSelector(selectContactError);

    console.log("selectedContactselectedContact",{selectedContact})

    useEffect(() => {
        if (id && !selectedContact) {
             dispatch(fetchContactById(id));
        }
    }, [dispatch, id]);

    // Handle 404/Error
    if (error) {
        return (
             <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <p className="text-destructive font-semibold">Error loading contact</p>
                <p className="text-muted-foreground">{error}</p>
                <Link href="/client/contacts">
                    <Button variant="outline">Go Back</Button>
                </Link>
            </div>
        );
    }

    // Show loader if loading OR if we don't have the contact yet (initial fetch)
    if (isLoading || (id && !selectedContact)) {
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
