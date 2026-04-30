'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchGreetings,
    createGreeting,
    updateGreeting,
    deleteGreeting,
    selectGreetings,
    selectGreetingsLoading,
    selectGreetingsError,
    clearGreetingsError,
} from '@/store/slices/greetings.slice';
import { GreetingsTable } from '@/components/admin/greetings/GreetingsTable';
import { GreetingForm } from '@/components/admin/greetings/GreetingForm';
import { Button } from '@/components/ui/button';
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
import {
    CreateGreetingDTO,
    Greeting,
    UpdateGreetingDTO,
} from '@/types/entities/greeting.types';

export default function AdminGreetingsPage() {
    const dispatch = useAppDispatch();
    const greetings = useAppSelector(selectGreetings);
    const loading = useAppSelector(selectGreetingsLoading);
    const error = useAppSelector(selectGreetingsError);

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedGreeting, setSelectedGreeting] = useState<Greeting | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [greetingToDelete, setGreetingToDelete] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchGreetings(true));
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            dispatch(clearGreetingsError());
        }
    }, [error, dispatch]);

    const handleCreate = async (data: CreateGreetingDTO | UpdateGreetingDTO) => {
        try {
            await dispatch(createGreeting(data as CreateGreetingDTO)).unwrap();
            setCreateDialogOpen(false);
            dispatch(fetchGreetings(true));
        } catch {
            /* error already in store */
        }
    };

    const handleEdit = (greeting: Greeting) => {
        setSelectedGreeting(greeting);
        setEditDialogOpen(true);
    };

    const handleUpdate = async (data: CreateGreetingDTO | UpdateGreetingDTO) => {
        if (!selectedGreeting) return;
        try {
            await dispatch(
                updateGreeting({ id: selectedGreeting.id, data: data as UpdateGreetingDTO })
            ).unwrap();
            setEditDialogOpen(false);
            setSelectedGreeting(null);
            dispatch(fetchGreetings(true));
        } catch {
            /* error already in store */
        }
    };

    const handleDelete = (id: string) => {
        setGreetingToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!greetingToDelete) return;
        try {
            await dispatch(deleteGreeting(greetingToDelete)).unwrap();
            setDeleteDialogOpen(false);
            setGreetingToDelete(null);
            dispatch(fetchGreetings(true));
        } catch {
            /* error already in store */
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Greetings</h1>
                    <p className="text-gray-600 mt-1">
                        Manage reusable greeting templates available to all clients in their campaigns.
                    </p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Greeting
                </Button>
            </div>

            <GreetingsTable
                greetings={greetings}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create greeting</DialogTitle>
                        <DialogDescription>
                            Add a new greeting template that clients can pick when composing campaigns.
                        </DialogDescription>
                    </DialogHeader>
                    <GreetingForm
                        onSubmit={handleCreate}
                        loading={loading}
                        onCancel={() => setCreateDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit greeting</DialogTitle>
                        <DialogDescription>
                            Existing campaigns keep the snapshot they were saved with — edits only
                            affect new picks.
                        </DialogDescription>
                    </DialogHeader>
                    <GreetingForm
                        greeting={selectedGreeting ?? undefined}
                        onSubmit={handleUpdate}
                        loading={loading}
                        onCancel={() => {
                            setEditDialogOpen(false);
                            setSelectedGreeting(null);
                        }}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete greeting?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This greeting will no longer appear in the client picker. Existing
                            campaigns that already saved this greeting keep working — they use
                            their own snapshot.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
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
