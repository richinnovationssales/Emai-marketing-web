'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Contact, FolderKanban, Settings } from 'lucide-react';

interface ClientStatsCardsProps {
    usersCount: number;
    contactsCount: number;
    groupsCount: number;
    customFieldsCount: number;
    onTabChange?: (tab: string) => void;
}

export function ClientStatsCards({
    usersCount,
    contactsCount,
    groupsCount,
    customFieldsCount,
    onTabChange
}: ClientStatsCardsProps) {
    const stats = [
        {
            label: 'Users',
            value: usersCount,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            tab: 'users'
        },
        {
            label: 'Contacts',
            value: contactsCount,
            icon: Contact,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            tab: 'contacts'
        },
        {
            label: 'Groups',
            value: groupsCount,
            icon: FolderKanban,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            tab: 'groups'
        },
        {
            label: 'Custom Fields',
            value: customFieldsCount,
            icon: Settings,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            tab: 'custom-fields'
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card
                        key={stat.label}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => onTabChange?.(stat.tab)}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {stat.label}
                                    </p>
                                    <p className="text-3xl font-bold mt-2">
                                        {stat.value.toLocaleString()}
                                    </p>
                                </div>
                                <div className={`${stat.bgColor} p-3 rounded-full`}>
                                    <Icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
