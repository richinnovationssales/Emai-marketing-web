'use client';

import React, { useState } from 'react';
import { ClientDetails, CustomField } from '@/types/entities/client.types';
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
import { ExternalLink, Star, StarOff, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { FieldTypeBadge } from './FieldTypeBadge';
import { clientService } from '@/lib/api/services/client.service';
import { toast } from 'sonner';

interface ClientTabsSectionProps {
    client: ClientDetails;
}

export function ClientTabsSection({ client }: ClientTabsSectionProps) {
    const [activeTab, setActiveTab] = useState('users');
    const [customFields, setCustomFields] = useState<CustomField[]>(client.customFields);
    const [togglingFieldId, setTogglingFieldId] = useState<string | null>(null);

    // Sync local state when the client prop changes (e.g. Redux re-fetch)
    React.useEffect(() => {
        setCustomFields(client.customFields);
    }, [client.id, client.customFields]);

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    const handleToggleNameField = async (field: CustomField) => {
        const newValue = !field.isNameField;
        setTogglingFieldId(field.id);
        try {
            await clientService.setNameField(client.id, field.id, newValue);
            // Update local state: reflect mutual exclusivity
            setCustomFields((prev) =>
                prev.map((f) => f.id === field.id ? { ...f, isNameField: newValue } : f)
            );
            toast.success(
                newValue
                    ? `"${field.name}" is now the Name Field`
                    : `"${field.name}" is no longer the Name Field`
            );
        } catch {
            toast.error('Failed to update Name Field');
        } finally {
            setTogglingFieldId(null);
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
                            All {client.customFieldsCount} custom fields configured for this client.
                            Mark one as <span className="font-semibold">Name Field</span> to use it as the contact&apos;s display name.
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
                                    <TableHead>Name Field</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customFields.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            No custom fields found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    customFields.map((field) => (
                                        <TableRow key={field.id}>
                                            <TableCell className="font-medium">
                                                <span className="flex items-center gap-1.5">
                                                    {field.isNameField && (
                                                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 shrink-0" />
                                                    )}
                                                    {field.name}
                                                </span>
                                            </TableCell>
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
                                            <TableCell>
                                                <Button
                                                    variant={field.isNameField ? 'default' : 'outline'}
                                                    size="sm"
                                                    className="h-7 gap-1.5"
                                                    disabled={togglingFieldId !== null}
                                                    onClick={() => handleToggleNameField(field)}
                                                >
                                                    {togglingFieldId === field.id ? (
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    ) : field.isNameField ? (
                                                        <>
                                                            <StarOff className="h-3.5 w-3.5" />
                                                            Remove
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Star className="h-3.5 w-3.5" />
                                                            Set as Name
                                                        </>
                                                    )}
                                                </Button>
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
