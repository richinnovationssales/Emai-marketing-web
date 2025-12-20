'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
    selectPlans,
    selectPlanLoading,
    selectPlanError,
    clearPlanError,
} from '@/store/slices/admin.slice';
import { PlansTable } from '@/components/admin/PlansTable';
import { PlanForm } from '@/components/admin/PlanForm';
import { PlanDetailsDialog } from '@/components/admin/PlanDetailsDialog';
import { PlanClientsDialog } from '@/components/admin/PlanClientsDialog';
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
// import { toast } from 'sonner';
import { Plan, CreatePlanDTO, UpdatePlanDTO } from '@/types/entities/plan.types';

export default function AdminPlansPage() {
    const dispatch = useAppDispatch();
    const plans = useAppSelector(selectPlans);
    const loading = useAppSelector(selectPlanLoading);
    const error = useAppSelector(selectPlanError);

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [clientsDialogOpen, setClientsDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchPlans());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            // toast.error(String(error));
            dispatch(clearPlanError());
        }
    }, [error, dispatch]);

    const handleCreatePlan = async (data: CreatePlanDTO | UpdatePlanDTO) => {
        try {
            await dispatch(createPlan(data as CreatePlanDTO)).unwrap();
            // toast.success('Plan created successfully');
            setCreateDialogOpen(false);
            dispatch(fetchPlans());
        } catch (err: any) {
            // toast.error(err || 'Failed to create plan');
        }
    };

    const handleViewPlan = (plan: Plan) => {
        setSelectedPlan(plan);
        setDetailsDialogOpen(true);
    };

    const handleEditPlan = (plan: Plan) => {
        setSelectedPlan(plan);
        setEditDialogOpen(true);
    };

    const handleUpdatePlan = async (data: CreatePlanDTO | UpdatePlanDTO) => {
        if (!selectedPlan) return;

        try {
            await dispatch(updatePlan({ id: selectedPlan.id, data: data as UpdatePlanDTO })).unwrap();
            // toast.success('Plan updated successfully');
            setEditDialogOpen(false);
            setSelectedPlan(null);
            dispatch(fetchPlans());
        } catch (err: any) {
            // toast.error(err || 'Failed to update plan');
        }
    };

    const handleViewClients = (plan: Plan) => {
        setSelectedPlan(plan);
        setClientsDialogOpen(true);
    };

    const handleDeletePlan = (id: string) => {
        setPlanToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDeletePlan = async () => {
        if (!planToDelete) return;

        try {
            await dispatch(deletePlan(planToDelete)).unwrap();
            // toast.success('Plan deleted successfully');
            setDeleteDialogOpen(false);
            setPlanToDelete(null);
            dispatch(fetchPlans());
        } catch (err: any) {
            // Error message from API will include client count if plan is in use
            // toast.error(err || 'Failed to delete plan');
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Plans</h1>
                    <p className="text-gray-600 mt-1">Manage subscription plans and pricing</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Plan
                </Button>
            </div>

            <PlansTable
                plans={plans}
                loading={loading}
                onView={handleViewPlan}
                onEdit={handleEditPlan}
                onViewClients={handleViewClients}
                onDelete={handleDeletePlan}
            />

            {/* Create Plan Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create New Plan</DialogTitle>
                        <DialogDescription>
                            Add a new subscription plan with pricing and email limits
                        </DialogDescription>
                    </DialogHeader>
                    <PlanForm
                        onSubmit={handleCreatePlan}
                        loading={loading}
                        onCancel={() => setCreateDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Plan Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Plan</DialogTitle>
                        <DialogDescription>
                            Update plan details, pricing, and email limits
                        </DialogDescription>
                    </DialogHeader>
                    <PlanForm
                        plan={selectedPlan || undefined}
                        onSubmit={handleUpdatePlan}
                        loading={loading}
                        onCancel={() => {
                            setEditDialogOpen(false);
                            setSelectedPlan(null);
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Plan Details Dialog */}
            <PlanDetailsDialog
                plan={selectedPlan}
                open={detailsDialogOpen}
                onOpenChange={setDetailsDialogOpen}
            />

            {/* Plan Clients Dialog */}
            <PlanClientsDialog
                plan={selectedPlan}
                open={clientsDialogOpen}
                onOpenChange={setClientsDialogOpen}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the plan.
                            <br /><br />
                            <strong>Note:</strong> You cannot delete a plan if any clients are currently using it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeletePlan}
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