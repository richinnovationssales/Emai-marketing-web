'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchGroupById,
  clearCurrentGroup,
  selectCurrentGroup,
  selectGroupsLoading,
} from '@/store/slices/group.slice';
import { ContactsTable } from '@/components/contacts/ContactsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ArrowLeft, Users, Calendar, UserPlus, Loader2 } from 'lucide-react';
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

  const isAdmin = user?.role === 'CLIENT_ADMIN' || user?.role === 'CLIENT_SUPER_ADMIN';

  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupById(groupId));
    }

    return () => {
      dispatch(clearCurrentGroup());
    };
  }, [groupId, dispatch]);



  

  const handleRemoveContact = async (contactId: string) => {
    // TODO: Implement remove contact from group API call
    toast.info('Remove contact functionality will be implemented with contact-group API');
  };

  const handleAddContacts = () => {
    // TODO: Implement add contacts dialog
    toast.info('Add contacts functionality will be implemented with contact-group API');
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
          The group you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => router.push('/client/groups')} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Groups
        </Button>
      </div>
    );
  }

  const contacts = group.contactGroups?.map((cg) => cg.contact) || [];
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
              
              {/* {group?.description && (
                <CardDescription className="text-base mt-2">
                  {group?.description}
                </CardDescription>
              )} */}

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
             {/* Add Contacts button removed or can be re-added if we want 'Add' feature here too, 
                 but current ContactsTable handles 'Add to Group' via its own toolbar if generic, 
                 but here we are INSIDE a group. 
                 The original had 'Add Contacts' button.
                 ContactsTable has 'Add to Group' (assign existing).
                 We might want a way to 'Add member to this group'. 
                 For now, let's restore structure first.
                 The ContactsTable has the 'Remove from Group' button.
             */}
             {isAdmin && (
              <Button onClick={handleAddContacts} size="sm" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add Contacts
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ContactsTable
            data={contacts} // ContactsTable now accepts Contact[]
            onDelete={(id) => {}} // Optional, handled internally via store for the most part now
            groupId={groupId}
          />
        </CardContent>
      </Card>

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
