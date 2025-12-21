'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ClientWithStats } from '@/types/entities/client.types';
import { ClientStatusBadge } from './ClientStatusBadge';
import { ClientAnalyticsCard } from './ClientAnalyticsCard';
import { Separator } from '@/components/ui/separator';
import { Calendar, Users, Mail, Layers, Building2 } from 'lucide-react';
import { FormattedDate } from '@/components/ui/formatted-date';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchClientAnalytics, selectClientAnalytics, selectClientLoading } from '@/store/slices/admin.slice';
import { useEffect } from 'react';

interface ClientDetailsDialogProps {
    client: ClientWithStats | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ClientDetailsDialog({ client, open, onOpenChange }: ClientDetailsDialogProps) {
    const dispatch = useAppDispatch();
    const analytics = useAppSelector(selectClientAnalytics);
    const loading = useAppSelector(selectClientLoading);

    useEffect(() => {
        if (client && open) {
            dispatch(fetchClientAnalytics(client.id));
        }
    }, [client, open, dispatch]);

    if (!client) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-2xl">{client.name}</DialogTitle>
                            <DialogDescription>Client Details and Analytics</DialogDescription>
                        </div>
                        <ClientStatusBadge isApproved={client.isApproved} isActive={client.isActive} />
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start space-x-3">
                                <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">Client ID</p>
                                    <p className="font-mono text-sm">{client.id}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">Created</p>
                                    <div><FormattedDate date={client.createdAt} formatStr="PPP" /></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Plan Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Plan Information</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Plan Name</span>
                                <span className="font-semibold">{client.plan.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Price</span>
                                <span className="font-semibold">${client.plan.price}/month</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Email Limit</span>
                                <span className="font-semibold">{client.plan.emailLimit.toLocaleString()} emails</span>
                            </div>
                            {client.remainingMessages !== null && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Remaining Messages</span>
                                    <span className="font-semibold">{client.remainingMessages.toLocaleString()}</span>
                                </div>
                            )}
                            {client.planStartDate && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Plan Start Date</span>
                                    <span><FormattedDate date={client.planStartDate} formatStr="PPP" /></span>
                                </div>
                            )}
                            {client.planRenewalDate && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Plan Renewal Date</span>
                                    <span><FormattedDate date={client.planRenewalDate} formatStr="PPP" /></span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Statistics */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Statistics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm text-gray-600">Users</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-600">{client?._count?.users}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Mail className="h-5 w-5 text-green-600" />
                                    <span className="text-sm text-gray-600">Contacts</span>
                                </div>
                                <p className="text-2xl font-bold text-green-600">{client?._count?.contacts.toLocaleString()}</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Calendar className="h-5 w-5 text-purple-600" />
                                    <span className="text-sm text-gray-600">Campaigns</span>
                                </div>
                                <p className="text-2xl font-bold text-purple-600">{client?._count?.campaigns}</p>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Layers className="h-5 w-5 text-orange-600" />
                                    <span className="text-sm text-gray-600">Groups</span>
                                </div>
                                <p className="text-2xl font-bold text-orange-600">{client?._count?.groups}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Analytics */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Campaign Analytics</h3>
                        <ClientAnalyticsCard analytics={analytics} loading={loading} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
