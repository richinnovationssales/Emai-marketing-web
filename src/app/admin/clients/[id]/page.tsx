'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchClientDetails,
    selectSelectedClientDetails,
    selectClientLoading,
    selectClientError,
    fetchPlans,
    selectPlans,
} from '@/store/slices/admin.slice';
import { ClientDetailsHeader } from '@/components/admin/ClientDetailsHeader';
import { ClientStatsCards } from '@/components/admin/ClientStatsCards';
import { ClientInfoCard } from '@/components/admin/ClientInfoCard';
import { ClientTabsSection } from '@/components/admin/ClientTabsSection';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function ClientDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState('users');

    const clientId = params.id as string;
    const client = useAppSelector(selectSelectedClientDetails);
    const plans = useAppSelector(selectPlans);
    const loading = useAppSelector(selectClientLoading);
    const error = useAppSelector(selectClientError);

    useEffect(() => {
        if (clientId) {
            dispatch(fetchClientDetails(clientId));
        }
        if (plans.length === 0) {
            dispatch(fetchPlans());
        }
    }, [clientId, dispatch]);

    if (loading && !client) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Not Found</AlertTitle>
                    <AlertDescription>Client not found</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin/clients">Clients</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{client.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header with client name and actions */}
            <ClientDetailsHeader client={client} />

            {/* Stats Cards */}
            <ClientStatsCards
                usersCount={client.usersCount}
                contactsCount={client.contactsCount}
                groupsCount={client.groupsCount}
                customFieldsCount={client.customFieldsCount}
                onTabChange={setActiveTab}
            />

            {/* Client Info Card */}
            <ClientInfoCard client={client} plans={plans} />

            {/* Tabs Section */}
            <ClientTabsSection client={client} />
        </div>
    );
}
