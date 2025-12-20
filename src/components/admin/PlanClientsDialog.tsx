'use client';

import { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plan } from '@/types/entities/plan.types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchClientsByPlan, selectPlanClients, selectPlanLoading } from '@/store/slices/admin.slice';
import { ClientStatusBadge } from './ClientStatusBadge';
import { FormattedDate } from '@/components/ui/formatted-date';

interface PlanClientsDialogProps {
    plan: Plan | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PlanClientsDialog({ plan, open, onOpenChange }: PlanClientsDialogProps) {
    const dispatch = useAppDispatch();
    const clients = useAppSelector(selectPlanClients);
    const loading = useAppSelector(selectPlanLoading);

    useEffect(() => {
        if (plan && open) {
            dispatch(fetchClientsByPlan(plan.id));
        }
    }, [plan, open, dispatch]);

    if (!plan) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Clients Using {plan.name}</DialogTitle>
                    <DialogDescription>
                        List of all clients subscribed to this plan
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <p className="text-gray-500">Loading clients...</p>
                        </div>
                    ) : clients.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No clients are using this plan yet.</p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Client Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clients.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell className="font-medium">{client.name}</TableCell>
                                            <TableCell>
                                                <ClientStatusBadge 
                                                    isApproved={client.isApproved} 
                                                    isActive={client.isActive} 
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormattedDate date={client.createdAt} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    
                    {!loading && clients.length > 0 && (
                        <div className="mt-4 text-sm text-gray-600">
                            Total: {clients.length} client{clients.length !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
