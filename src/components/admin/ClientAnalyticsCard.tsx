'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientAnalytics } from '@/types/entities/client.types';
import { Mail, Calendar, Send, Package } from 'lucide-react';

interface ClientAnalyticsCardProps {
    analytics: ClientAnalytics | null;
    loading?: boolean;
}

export function ClientAnalyticsCard({ analytics, loading }: ClientAnalyticsCardProps) {
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>Loading analytics data...</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (!analytics) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>No analytics data available</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const stats = [
        {
            label: 'Total Emails Sent',
            value: analytics.totalEmailsSent?.toLocaleString() || '0',
            icon: Mail,
            color: 'text-blue-600',
        },
        {
            label: 'Campaigns Scheduled',
            value: analytics.campaignsScheduled?.toString() || '0',
            icon: Calendar,
            color: 'text-purple-600',
        },
        {
            label: 'Campaigns Sent',
            value: analytics.campaignsSent?.toString() || '0',
            icon: Send,
            color: 'text-green-600',
        },
        {
            label: 'Remaining Messages',
            value: analytics.remainingMessages?.toLocaleString() || 'Unlimited',
            icon: Package,
            color: 'text-orange-600',
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Analytics</CardTitle>
                {analytics.planName && (
                    <CardDescription>Plan: {analytics.planName}</CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.label} className="flex items-start space-x-3">
                                <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-semibold">{stat.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
