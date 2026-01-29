'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/slices/auth.slice';
import { approveClient, deactivateClient, reactivateClient, deleteClient } from '@/store/slices/admin.slice';
import { ClientDetails } from '@/types/entities/client.types';
import { AdminRole } from '@/types/enums/admin-role.enum';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CheckCircle, XCircle, MoreVertical, Power, PowerOff, Trash2, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ClientDetailsHeaderProps {
    client: ClientDetails;
}

export function ClientDetailsHeader({ client }: ClientDetailsHeaderProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const currentUser = useAppSelector(selectCurrentUser);
    const isSuperAdmin = currentUser?.role === AdminRole.SUPER_ADMIN;

    const handleApprove = () => {
        if (confirm('Are you sure you want to approve this client?')) {
            dispatch(approveClient(client.id));
        }
    };

    const handleDeactivate = () => {
        if (confirm('Are you sure you want to deactivate this client? They will lose access to the system.')) {
            dispatch(deactivateClient(client.id));
        }
    };

    const handleReactivate = () => {
        dispatch(reactivateClient(client.id));
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
            dispatch(deleteClient(client.id));
            router.push('/admin/clients');
        }
    };

    return (
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
                <div className="flex items-center gap-2">
                    <Badge variant={client.isApproved ? 'default' : 'secondary'}>
                        {client.isApproved ? (
                            <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approved
                            </>
                        ) : (
                            <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Pending Approval
                            </>
                        )}
                    </Badge>
                    <Badge variant={client.isActive ? 'default' : 'destructive'}>
                        {client.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">{client.plan.name}</Badge>
                </div>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {!client.isApproved && (
                        <DropdownMenuItem onClick={handleApprove}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Client
                        </DropdownMenuItem>
                    )}
                    {client.isActive ? (
                        <DropdownMenuItem onClick={handleDeactivate}>
                            <PowerOff className="h-4 w-4 mr-2" />
                            Deactivate
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem onClick={handleReactivate}>
                            <Power className="h-4 w-4 mr-2" />
                            Reactivate
                        </DropdownMenuItem>
                    )}
                    {isSuperAdmin && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push(`/admin/clients/${client.id}/domain`)}>
                                <Globe className="h-4 w-4 mr-2" />
                                Domain Settings
                            </DropdownMenuItem>
                        </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Client
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
