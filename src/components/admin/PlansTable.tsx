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
import { Plan } from '@/types/entities/plan.types';
import { Search } from 'lucide-react';
import { PlanActionsMenu } from './PlanActionsMenu';
import { FormattedDate } from '@/components/ui/formatted-date';

interface PlansTableProps {
    plans: Plan[];
    loading?: boolean;
    onView: (plan: Plan) => void;
    onEdit: (plan: Plan) => void;
    onViewClients: (plan: Plan) => void;
    onDelete: (id: string) => void;
}

export function PlansTable({
    plans,
    loading,
    onView,
    onEdit,
    onViewClients,
    onDelete,
}: PlansTableProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPlans = plans?.filter((plan) =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <p className="text-gray-500">Loading plans...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search plans by name..."
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
                            <TableHead>Price</TableHead>
                            <TableHead>Email Limit</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPlans?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    {searchTerm ? 'No plans found matching your search.' : 'No plans yet.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPlans?.map((plan) => (
                                <TableRow key={plan.id}>
                                    <TableCell className="font-medium">{plan.name}</TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-green-600">
                                            ${plan.price.toFixed(2)}
                                        </span>
                                        <span className="text-sm text-gray-500">/month</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium">
                                            {plan.emailLimit.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-gray-500"> emails</span>
                                    </TableCell>
                                    <TableCell>
                                        <FormattedDate date={plan.createdAt} />
                                    </TableCell>
                                    <TableCell>
                                        <FormattedDate date={plan.updatedAt} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <PlanActionsMenu
                                            plan={plan}
                                            onView={onView}
                                            onEdit={onEdit}
                                            onViewClients={onViewClients}
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
