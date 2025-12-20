'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchClients,
    fetchPendingClients,
    fetchPlans,
    createClient,
    approveClient,
    rejectClient,
    deactivateClient,
    reactivateClient,
    deleteClient,
    selectClients,
    selectPendingClients,
    selectPlans,
    selectClientLoading,
    selectClientError,
    clearClientError,
} from '@/store/slices/admin.slice';
import { ClientsTable } from '@/components/admin/ClientsTable';
import { ClientForm } from '@/components/admin/ClientForm';
import { ClientDetailsDialog } from '@/components/admin/ClientDetailsDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ClientWithStats, CreateClientDTO } from '@/types/entities/client.types';

export default function AdminClientsPage() {
    const dispatch = useAppDispatch();
    const clients = useAppSelector(selectClients);
    const pendingClients = useAppSelector(selectPendingClients);
    const plans = useAppSelector(selectPlans);
    const loading = useAppSelector(selectClientLoading);
    const error = useAppSelector(selectClientError);

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<ClientWithStats | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchClients());
        dispatch(fetchPendingClients());
        dispatch(fetchPlans());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearClientError());
        }
    }, [error, dispatch]);

    const handleCreateClient = async (data: CreateClientDTO) => {
        try {
            await dispatch(createClient(data)).unwrap();
            toast.success('Client created successfully');
            setCreateDialogOpen(false);
            dispatch(fetchClients());
        } catch (err: any) {
            toast.error(err || 'Failed to create client');
        }
    };

    const handleViewClient = (client: ClientWithStats) => {
        setSelectedClient(client);
        setDetailsDialogOpen(true);
    };

    const handleEditClient = (client: ClientWithStats) => {
        // TODO: Implement edit functionality
        toast.info('Edit functionality coming soon');
    };

    const handleApproveClient = async (id: string) => {
        try {
            await dispatch(approveClient(id)).unwrap();
            toast.success('Client approved successfully');
            dispatch(fetchClients());
            dispatch(fetchPendingClients());
        } catch (err: any) {
            toast.error(err || 'Failed to approve client');
        }
    };

    const handleRejectClient = async (id: string) => {
        try {
            await dispatch(rejectClient(id)).unwrap();
            toast.success('Client rejected successfully');
            dispatch(fetchClients());
            dispatch(fetchPendingClients());
        } catch (err: any) {
            toast.error(err || 'Failed to reject client');
        }
    };

    const handleActivateClient = async (id: string) => {
        try {
            await dispatch(reactivateClient(id)).unwrap();
            toast.success('Client reactivated successfully');
            dispatch(fetchClients());
        } catch (err: any) {
            toast.error(err || 'Failed to reactivate client');
        }
    };

    const handleDeactivateClient = async (id: string) => {
        try {
            await dispatch(deactivateClient(id)).unwrap();
            toast.success('Client deactivated successfully');
            dispatch(fetchClients());
        } catch (err: any) {
            toast.error(err || 'Failed to deactivate client');
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
            dispatch(fetchClients());
            dispatch(fetchPendingClients());
        } catch (err: any) {
            toast.error(err || 'Failed to delete client');
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Clients</h1>
                    <p className="text-gray-600 mt-1">Manage your clients and their subscriptions</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Client
                </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">
                        All Clients ({clients.length})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                        Pending Approvals ({pendingClients.length})
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-6">
                    <ClientsTable
                        clients={clients}
                        loading={loading}
                        onView={handleViewClient}
                        onEdit={handleEditClient}
                        onApprove={handleApproveClient}
                        onReject={handleRejectClient}
                        onActivate={handleActivateClient}
                        onDeactivate={handleDeactivateClient}
                        onDelete={handleDeleteClient}
                    />
                </TabsContent>
                <TabsContent value="pending" className="mt-6">
                    <ClientsTable
                        clients={pendingClients}
                        loading={loading}
                        onView={handleViewClient}
                        onEdit={handleEditClient}
                        onApprove={handleApproveClient}
                        onReject={handleRejectClient}
                        onDelete={handleDeleteClient}
                    />
                </TabsContent>
            </Tabs>

            {/* Create Client Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create New Client</DialogTitle>
                        <DialogDescription>
                            Add a new client to the system with their subscription plan
                        </DialogDescription>
                    </DialogHeader>
                    <ClientForm
                        plans={plans}
                        onSubmit={handleCreateClient}
                        loading={loading}
                    />
                </DialogContent>
            </Dialog>

            {/* Client Details Dialog */}
            <ClientDetailsDialog
                client={selectedClient}
                open={detailsDialogOpen}
                onOpenChange={setDetailsDialogOpen}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the client
                            and all associated data including users, contacts, campaigns, and groups.
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