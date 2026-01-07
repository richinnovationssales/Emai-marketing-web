'use client';

import { Contact } from '@/types/entities/contact.types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { bulkDeleteContacts, setSelectedContact } from '@/store/slices/contact.slice';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

interface ContactsTableProps {
    data: Contact[];
    onDelete: (id: string) => void;
}

export function ContactsTable({ data, onDelete }: ContactsTableProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(data.map(c => c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
        }
    };

    const handleBulkDelete = () => {
        if (confirm(`Are you sure you want to delete ${selectedIds.length} contact(s)?`)) {
            dispatch(bulkDeleteContacts(selectedIds));
            setSelectedIds([]);
        }
    };
    
    // Override single delete to use bulk delete logic for consistency if preferred, 
    // or just keep using the props. But user asked for consistency and use bulk delete api.
    const handleSingleDelete = (id: string) => {
         if (confirm('Are you sure you want to delete this contact?')) {
            dispatch(bulkDeleteContacts([id]));
        }
    };

    return (
        <div className="space-y-4">
            {selectedIds.length > 0 && (
                <div className="flex items-center justify-between bg-muted/50 p-2 px-4 rounded-md border">
                    <span className="text-sm font-medium">{selectedIds.length} selected</span>
                    <div className="flex gap-2">
                         <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={handleBulkDelete}
                        >
                            Delete Selected
                        </Button>
                    </div>
                </div>
            )}
            <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox 
                                checked={data.length > 0 && selectedIds.length === data.length}
                                onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                            />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Group</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No contacts found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((contact) => {
                             if (!contact) return null;
                             
                             // Helper to get field value from root or customFields
                             const getFieldValue = (field: string) => {
                                 const rootVal = (contact as any)[field];
                                 if (rootVal) return rootVal;
                                 
                                 // Check simple key in customFields
                                 if (contact.customFields && contact.customFields[field]) {
                                     // If it's a simple value
                                     if (typeof contact.customFields[field] !== 'object') {
                                         return contact.customFields[field];
                                     }
                                     // If its the complex object { value: "...", ... }
                                     return contact.customFields[field]?.value;
                                 }
                                 return '';
                             };

                             const firstName = getFieldValue('firstName');
                             const lastName = getFieldValue('lastName');
                             const email = getFieldValue('email'); // Email should be root, but just in case
                             const phone = getFieldValue('phone') || getFieldValue('phoneNumber'); // Handle phone/phoneNumber variance

                            return (
                                <TableRow key={contact?.id}>
                                <TableCell>
                                    <Checkbox 
                                        checked={selectedIds.includes(contact.id)}
                                        onCheckedChange={(checked) => handleSelectRow(contact.id, checked as boolean)}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                        {firstName} {lastName}
                                    </TableCell>
                                    <TableCell>{email}</TableCell>
                                    <TableCell>{phone || '-'}</TableCell>
                                    <TableCell>{contact?.groupId || '-'}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link href={`/client/contacts/${contact?.id}/edit`} onClick={() => dispatch(setSelectedContact(contact))}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() => handleSingleDelete(contact?.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
            </div>
        </div>
    );
}
