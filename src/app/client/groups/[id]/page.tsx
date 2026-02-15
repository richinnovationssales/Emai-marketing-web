'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchGroupById,
  clearCurrentGroup,
  selectCurrentGroup,
  selectGroupsLoading,
  assignContactsToGroup,
} from '@/store/slices/group.slice';
import { fetchContacts, selectContacts } from '@/store/slices/contact.slice';
import { ContactsTable } from '@/components/contacts/ContactsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ArrowLeft, Users, Calendar, UserPlus, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { selectCurrentUser } from '@/store/slices/auth.slice';

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const groupId = params.id as string;
  const group = useAppSelector(selectCurrentGroup);
  const loading = useAppSelector(selectGroupsLoading);
  const user = useAppSelector(selectCurrentUser);
  const allContacts = useAppSelector(selectContacts);

  const isAdmin = user?.role === 'CLIENT_ADMIN' || user?.role === 'CLIENT_SUPER_ADMIN';

  // Add Contacts dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupById(groupId));
    }

    return () => {
      dispatch(clearCurrentGroup());
    };
  }, [groupId, dispatch]);

  // Fetch all contacts when the add dialog opens
  useEffect(() => {
    if (addDialogOpen && allContacts.length === 0) {
      dispatch(fetchContacts({ limit: 1000 }));
    }
  }, [addDialogOpen, dispatch, allContacts.length]);

  // Contacts already in this group
  const contacts = useMemo(
    () => group?.contactGroups?.map((cg) => cg.contact) || [],
    [group?.contactGroups]
  );
  const existingContactIds = useMemo(
    () => new Set(contacts.map((c) => c.id)),
    [contacts]
  );

  // Filter contacts for the add dialog: exclude already-in-group, apply search
  const availableContacts = useMemo(() => {
    return allContacts
      .filter((c) => !existingContactIds.has(c.id))
      .filter((c) =>
        !searchQuery || c.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [allContacts, existingContactIds, searchQuery]);

  const handleToggleContact = (contactId: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleAddContacts = async () => {
    if (selectedContactIds.length === 0) return;
    setIsAssigning(true);
    try {
      await dispatch(
        assignContactsToGroup({ groupId, contactIds: selectedContactIds })
      ).unwrap();
      toast.success(`Added ${selectedContactIds.length} contact(s) to group`);
      setAddDialogOpen(false);
      setSelectedContactIds([]);
      setSearchQuery('');
      // Re-fetch group to update the contacts list
      dispatch(fetchGroupById(groupId));
    } catch (err: unknown) {
      toast.error((err as string) || 'Failed to add contacts');
    } finally {
      setIsAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Group not found
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          The group you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
        <Button onClick={() => router.push('/client/groups')} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Groups
        </Button>
      </div>
    );
  }

  const createdDate = new Date(group.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/client/groups">Groups</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{group.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-2xl">{group.name}</CardTitle>
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3 w-3" />
                  {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
                </Badge>
              </div>

              <div className="flex items-center gap-2 mt-4 text-sm text-slate-600 dark:text-slate-400">
                <Calendar className="h-4 w-4" />
                <span>Created on {createdDate}</span>
              </div>
            </div>

            <Button onClick={() => router.push('/client/groups')} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Contacts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contacts</CardTitle>
              <CardDescription>
                Manage contacts in this group
              </CardDescription>
            </div>
            {isAdmin && (
              <Button onClick={() => setAddDialogOpen(true)} size="sm" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add Contacts
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ContactsTable
            data={contacts}
            groupId={groupId}
          />
        </CardContent>
      </Card>

      {/* Add Contacts Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={(open) => {
        setAddDialogOpen(open);
        if (!open) {
          setSelectedContactIds([]);
          setSearchQuery('');
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Contacts to {group.name}</DialogTitle>
            <DialogDescription>
              Search and select contacts to add to this group.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Contact list */}
            <div className="max-h-[300px] overflow-y-auto border rounded-md">
              {availableContacts.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  {searchQuery ? 'No matching contacts found.' : 'All contacts are already in this group.'}
                </div>
              ) : (
                availableContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-accent cursor-pointer border-b last:border-b-0"
                    onClick={() => handleToggleContact(contact.id)}
                  >
                    <Checkbox
                      checked={selectedContactIds.includes(contact.id)}
                      onCheckedChange={() => handleToggleContact(contact.id)}
                    />
                    <span className="text-sm">{contact.email}</span>
                  </div>
                ))
              )}
            </div>

            {selectedContactIds.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedContactIds.length} contact(s) selected
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddContacts}
              disabled={selectedContactIds.length === 0 || isAssigning}
            >
              {isAssigning && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add {selectedContactIds.length > 0 ? `${selectedContactIds.length} Contact(s)` : 'Contacts'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Statistics Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {contacts.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              With Custom Fields
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {contacts.filter((c) => c.customFieldValues.length > 0).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Custom Fields
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {contacts.reduce((sum, c) => sum + c.customFieldValues.length, 0)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
