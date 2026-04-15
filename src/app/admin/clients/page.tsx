'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
    clearCustomFieldsBuilder,
} from '@/store/slices/admin.slice';
import { ClientsTable } from '@/components/admin/ClientsTable';
import { ClientForm } from '@/components/admin/ClientForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
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
import { Plus, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { ClientWithStats, CreateClientDTO } from '@/types/entities/client.types';
import { getErrorMessage } from '@/lib/utils/error';
import { clientService } from '@/lib/api/services/client.service';

export default function AdminClientsPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const clients = useAppSelector(selectClients);
    const pendingClients = useAppSelector(selectPendingClients);
    const plans = useAppSelector(selectPlans);
    const loading = useAppSelector(selectClientLoading);
    const error = useAppSelector(selectClientError);

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<string | null>(null);

    const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
    const [clientToResetPassword, setClientToResetPassword] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchClients());
        dispatch(fetchPendingClients());
        dispatch(fetchPlans());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(getErrorMessage(error));
            dispatch(clearClientError());
        }
    }, [error, dispatch]);

    const handleCreateClient = async (data: CreateClientDTO) => {
        try {
            await dispatch(createClient(data)).unwrap();
            toast.success('Client created successfully');
            setCreateDialogOpen(false);
            dispatch(clearCustomFieldsBuilder());
            dispatch(fetchClients());
        } catch (err: any) {
            toast.error(getErrorMessage(err, 'Failed to create client'));
        }
    };

    const handleViewClient = (client: ClientWithStats) => {
        router.push(`/admin/clients/${client.id}`);
    };

    const handleEditClient = (client: ClientWithStats) => {
        // TODO: Implement edit functionality
         router.push(`/admin/clients/${client.id}`);
        // toast.info('Edit functionality coming soon');
    };

    const handleApproveClient = async (id: string) => {
        try {
            await dispatch(approveClient(id)).unwrap();
            toast.success('Client approved successfully');
            dispatch(fetchClients());
            dispatch(fetchPendingClients());
        } catch (err: any) {
            toast.error(getErrorMessage(err, 'Failed to approve client'));
        }
    };

    const handleRejectClient = async (id: string) => {
        try {
            await dispatch(rejectClient(id)).unwrap();
            toast.success('Client rejected successfully');
            dispatch(fetchClients());
            dispatch(fetchPendingClients());
        } catch (err: any) {
            toast.error(getErrorMessage(err, 'Failed to reject client'));
        }
    };

    const handleActivateClient = async (id: string) => {
        try {
            await dispatch(reactivateClient(id)).unwrap();
            toast.success('Client reactivated successfully');
            dispatch(fetchClients());
        } catch (err: any) {
            toast.error(getErrorMessage(err, 'Failed to reactivate client'));
        }
    };

    const handleDeactivateClient = async (id: string) => {
        try {
            await dispatch(deactivateClient(id)).unwrap();
            toast.success('Client deactivated successfully');
            dispatch(fetchClients());
        } catch (err: any) {
            toast.error(getErrorMessage(err, 'Failed to deactivate client'));
        }
    };

    const handleDeleteClient = (id: string) => {
        setClientToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleResetPassword = (id: string) => {
        setClientToResetPassword(id);
        setNewPassword('');
        setShowPassword(false);
        setResetPasswordDialogOpen(true);
    };

    const confirmResetPassword = async () => {
        if (!clientToResetPassword || !newPassword) return;
        setResetPasswordLoading(true);
        try {
            await clientService.resetPassword(clientToResetPassword, newPassword);
            toast.success('Password reset successfully');
            setResetPasswordDialogOpen(false);
            setClientToResetPassword(null);
            setNewPassword('');
        } catch (err: any) {
            toast.error(getErrorMessage(err, 'Failed to reset password'));
        } finally {
            setResetPasswordLoading(false);
        }
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
            toast.error(getErrorMessage(err, 'Failed to delete client'));
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
                        All Clients ({clients?.length})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                        Pending Approvals ({pendingClients?.length})
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
                        onResetPassword={handleResetPassword}
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
                        onResetPassword={handleResetPassword}
                    />
                </TabsContent>
            </Tabs>

            {/* Create Client Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

            {/* Reset Password Dialog */}
            <Dialog
                open={resetPasswordDialogOpen}
                onOpenChange={(open) => {
                    if (resetPasswordLoading) return;
                    if (!open) {
                        setNewPassword('');
                        setShowPassword(false);
                    }
                    setResetPasswordDialogOpen(open);
                }}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reset Client Password</DialogTitle>
                        <DialogDescription>
                            This will reset the password for the client&apos;s primary admin account (CLIENT_SUPER_ADMIN).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                            <Input
                                id="new-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter new password (min. 8 characters)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword((v) => !v)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" disabled={resetPasswordLoading} onClick={() => setResetPasswordDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmResetPassword}
                            disabled={resetPasswordLoading || newPassword.length < 8}
                        >
                            {resetPasswordLoading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}