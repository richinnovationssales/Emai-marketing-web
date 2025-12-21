'use client';

import React, { useState } from 'react';
import { ClientDetails } from '@/types/entities/client.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {  
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { FieldTypeBadge } from './FieldTypeBadge';

interface ClientTabsSectionProps {
    client: ClientDetails;
}

export function ClientTabsSection({ client }: ClientTabsSectionProps) {
    const [activeTab, setActiveTab] = useState('users');

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="users">Users ({client.usersCount})</TabsTrigger>
                <TabsTrigger value="contacts">Contacts ({client.contactsCount})</TabsTrigger>
                <TabsTrigger value="groups">Groups ({client.groupsCount})</TabsTrigger>
                <TabsTrigger value="custom-fields">Custom Fields ({client.customFieldsCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Users</CardTitle>
                                <CardDescription>
                                    Showing {Math.min(10, client.users.length)} of {client.usersCount} users
                                </CardDescription>
                            </div>
                            {client.usersCount > 10 && (
                                <Button variant="outline" size="sm">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View All {client.usersCount} Users
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Created At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {client.users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    client.users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{user.role}</Badge>
                                            </TableCell>
                                            <TableCell>{formatDate(user.createdAt)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="contacts">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Contacts</CardTitle>
                                <CardDescription>
                                    Showing {Math.min(10, client.contacts.length)} of {client.contactsCount} contacts
                                </CardDescription>
                            </div>
                            {client.contactsCount > 10 && (
                                <Button variant="outline" size="sm">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View All {client.contactsCount} Contacts
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Created At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {client.contacts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                                            No contacts found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    client.contacts.map((contact) => (
                                        <TableRow key={contact.id}>
                                            <TableCell className="font-medium">
                                                {contact.firstName || contact.lastName
                                                    ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim()
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell>{contact.email}</TableCell>
                                            <TableCell>{formatDate(contact.createdAt)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="groups">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Groups</CardTitle>
                                <CardDescription>
                                    Showing {Math.min(10, client.groups.length)} of {client.groupsCount} groups
                                </CardDescription>
                            </div>
                            {client.groupsCount > 10 && (
                                <Button variant="outline" size="sm">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View All {client.groupsCount} Groups
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Created At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {client.groups.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center text-muted-foreground">
                                            No groups found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    client.groups.map((group) => (
                                        <TableRow key={group.id}>
                                            <TableCell className="font-medium">{group.name}</TableCell>
                                            <TableCell>{formatDate(group.createdAt)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="custom-fields">
                <Card>
                    <CardHeader>
                        <CardTitle>Custom Fields</CardTitle>
                        <CardDescription>
                            All {client.customFieldsCount} custom fields configured for this client
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Key</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Required</TableHead>
                                    <TableHead>Active</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {client.customFields.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            No custom fields found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    client.customFields.map((field) => (
                                        <TableRow key={field.id}>
                                            <TableCell className="font-medium">{field.name}</TableCell>
                                            <TableCell>
                                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                                    {field.fieldKey}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                <FieldTypeBadge type={field.type} />
                                            </TableCell>
                                            <TableCell>
                                                {field.isRequired ? (
                                                    <Badge variant="destructive">Required</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Optional</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={field.isActive ? 'default' : 'secondary'}>
                                                    {field.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
