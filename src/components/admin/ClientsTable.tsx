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
import { ClientWithStats } from '@/types/entities/client.types';
import { ClientStatusBadge } from './ClientStatusBadge';
import { ClientActionsMenu } from './ClientActionsMenu';
import { Search } from 'lucide-react';
import { FormattedDate } from '@/components/ui/formatted-date';

interface ClientsTableProps {
    clients: ClientWithStats[];
    loading?: boolean;
    onView: (client: ClientWithStats) => void;
    onEdit: (client: ClientWithStats) => void;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    onActivate?: (id: string) => void;
    onDeactivate?: (id: string) => void;
    onDelete: (id: string) => void;
}

export function ClientsTable({
    clients,
    loading,
    onView,
    onEdit,
    onApprove,
    onReject,
    onActivate,
    onDeactivate,
    onDelete,
}: ClientsTableProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClients = clients?.filter((client) =>
        client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client?.plan?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <p className="text-gray-500">Loading clients...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search clients by name or plan..."
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
                            <TableHead>Plan</TableHead>
                            <TableHead>Status</TableHead>
                            {/* <TableHead>Users</TableHead> */}
                            {/* <TableHead>Contacts</TableHead> */}
                            {/* <TableHead>Campaigns</TableHead> */}
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClients?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                    {searchTerm ? 'No clients found matching your search.' : 'No clients yet.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredClients?.map((client) => (
                                <TableRow 
                                    key={client.id} 
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => onView(client)}
                                >
                                    <TableCell className="font-medium">{client.name}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{client.plan.name}</p>
                                            <p className="text-sm text-gray-500">
                                                ${client.plan.price}/mo · {client.plan.emailLimit.toLocaleString()} emails
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <ClientStatusBadge 
                                            isApproved={client.isApproved} 
                                            isActive={client.isActive} 
                                        />
                                    </TableCell>
                                    {/* <TableCell>{client?._count?.users}</TableCell> */}
                                    {/* <TableCell>{client?._count?.contacts.toLocaleString()}</TableCell> */}
                                    {/* <TableCell>{client?._count?.campaigns}</TableCell> */}
                                    <TableCell>
                                        <FormattedDate date={client.createdAt} />
                                    </TableCell>
                                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                        <ClientActionsMenu
                                            client={client}
                                            onView={onView}
                                            onEdit={onEdit}
                                            onApprove={onApprove}
                                            onReject={onReject}
                                            onActivate={onActivate}
                                            onDeactivate={onDeactivate}
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
