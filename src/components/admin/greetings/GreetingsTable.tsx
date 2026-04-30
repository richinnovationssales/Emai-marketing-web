'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Greeting } from '@/types/entities/greeting.types';
import { Search } from 'lucide-react';
import { GreetingActionsMenu } from './GreetingActionsMenu';
import { FormattedDate } from '@/components/ui/formatted-date';
import { Badge } from '@/components/ui/badge';

interface GreetingsTableProps {
    greetings: Greeting[];
    loading?: boolean;
    onEdit: (greeting: Greeting) => void;
    onDelete: (id: string) => void;
}

export function GreetingsTable({
    greetings,
    loading,
    onEdit,
    onDelete,
}: GreetingsTableProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = greetings?.filter(
        (g) =>
            g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.template.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <p className="text-gray-500">Loading greetings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search by name or template..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Template</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    {searchTerm ? 'No greetings match your search.' : 'No greetings yet.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered?.map((greeting) => (
                                <TableRow key={greeting.id}>
                                    <TableCell className="font-medium">{greeting.name}</TableCell>
                                    <TableCell>
                                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                            {greeting.template}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        {greeting.isActive ? (
                                            <Badge variant="default">Active</Badge>
                                        ) : (
                                            <Badge variant="secondary">Inactive</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <FormattedDate date={greeting.createdAt} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <GreetingActionsMenu
                                            greeting={greeting}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
