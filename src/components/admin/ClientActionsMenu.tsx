'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, CheckCircle, XCircle, Power, PowerOff, Trash2 } from 'lucide-react';
import { ClientWithStats } from '@/types/entities/client.types';

interface ClientActionsMenuProps {
    client: ClientWithStats;
    onView: (client: ClientWithStats) => void;
    onEdit: (client: ClientWithStats) => void;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    onActivate?: (id: string) => void;
    onDeactivate?: (id: string) => void;
    onDelete: (id: string) => void;
}

export function ClientActionsMenu({
    client,
    onView,
    onEdit,
    onApprove,
    onReject,
    onActivate,
    onDeactivate,
    onDelete,
}: ClientActionsMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onView(client)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(client)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                
                {!client.isApproved && (
                    <>
                        <DropdownMenuSeparator />
                        {onApprove && (
                            <DropdownMenuItem onClick={() => onApprove(client.id)}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                Approve
                            </DropdownMenuItem>
                        )}
                        {onReject && (
                            <DropdownMenuItem onClick={() => onReject(client.id)}>
                                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                Reject
                            </DropdownMenuItem>
                        )}
                    </>
                )}
                
                {client.isApproved && (
                    <>
                        <DropdownMenuSeparator />
                        {client.isActive && onDeactivate ? (
                            <DropdownMenuItem onClick={() => onDeactivate(client.id)}>
                                <PowerOff className="mr-2 h-4 w-4 text-orange-600" />
                                Deactivate
                            </DropdownMenuItem>
                        ) : onActivate ? (
                            <DropdownMenuItem onClick={() => onActivate(client.id)}>
                                <Power className="mr-2 h-4 w-4 text-green-600" />
                                Reactivate
                            </DropdownMenuItem>
                        ) : null}
                    </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onClick={() => onDelete(client.id)}
                    className="text-red-600 focus:text-red-600"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
