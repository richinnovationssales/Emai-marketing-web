'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchPendingClients,
    approveClient,
    rejectClient,
    deleteClient,
    selectPendingClients,
    selectClientLoading,
    selectClientError,
    clearClientError,
} from '@/store/slices/admin.slice';
import { ClientsTable } from '@/components/admin/ClientsTable';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { ClientWithStats } from '@/types/entities/client.types';
import { getErrorMessage } from '@/lib/utils/error';

export default function AdminPendingClientsPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const pendingClients = useAppSelector(selectPendingClients);
    const loading = useAppSelector(selectClientLoading);
    const error = useAppSelector(selectClientError);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchPendingClients());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(getErrorMessage(error));
            dispatch(clearClientError());
        }
    }, [error, dispatch]);

    const handleViewClient = (client: ClientWithStats) => {
        router.push(`/admin/clients/${client.id}`);
    };

    const handleApproveClient = async (id: string) => {
        try {
            await dispatch(approveClient(id)).unwrap();
            toast.success('Client approved successfully');
            dispatch(fetchPendingClients());
        } catch (err: any) {
            toast.error(getErrorMessage(err, 'Failed to approve client'));
        }
    };

    const handleRejectClient = async (id: string) => {
        try {
            await dispatch(rejectClient(id)).unwrap();
            toast.success('Client rejected successfully');
            dispatch(fetchPendingClients());
        } catch (err: any) {
            toast.error(getErrorMessage(err, 'Failed to reject client'));
        }
    };

    const handleDeleteClient = (id: string) => {
        setClientToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteClient = async () => {
        if (!clientToDelete) return;

        try {
            await dispatch(deleteClient(clientToDelete)).unwrap();
            toast.success('Client deleted successfully');
            setDeleteDialogOpen(false);
            setClientToDelete(null);
            dispatch(fetchPendingClients());
        } catch (err: any) {
            toast.error(getErrorMessage(err, 'Failed to delete client'));
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Pending Clients</h1>
                    <p className="text-gray-600 mt-1">
                        Review and approve new client registrations
                    </p>
                </div>
                <Button variant="outline" onClick={() => router.push('/admin/clients')}>
                    Back to All Clients
                </Button>
            </div>

            <ClientsTable
                clients={pendingClients}
                loading={loading}
                onView={handleViewClient}
                onApprove={handleApproveClient}
                onReject={handleRejectClient}
                onDelete={handleDeleteClient} onEdit={function (client: ClientWithStats): void {
                    throw new Error('Function not implemented.');
                } }            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the client
                            and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteClient}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
