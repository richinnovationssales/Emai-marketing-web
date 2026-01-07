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
import { setSelectedContact } from '@/store/slices/contact.slice';
import Link from 'next/link';

interface ContactsTableProps {
    data: Contact[];
    onDelete: (id: string) => void;
}

export function ContactsTable({ data, onDelete }: ContactsTableProps) {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
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
                        data.map((contact) => (
                            <TableRow key={contact?.id}>
                                <TableCell className="font-medium">
                                    {contact?.firstName} {contact?.lastName}
                                </TableCell>
                                <TableCell>{contact?.email}</TableCell>
                                <TableCell>{contact?.phone || '-'}</TableCell>
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
                                        onClick={() => onDelete(contact?.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
