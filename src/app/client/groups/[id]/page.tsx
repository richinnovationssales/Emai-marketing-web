"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchGroupById,
  clearCurrentGroup,
  selectCurrentGroup,
  selectGroupsLoading,
  assignContactsToGroup,
} from "@/store/slices/group.slice";
import { fetchContacts, selectContacts } from "@/store/slices/contact.slice";
import { ContactsTable } from "@/components/contacts/ContactsTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  Users,
  Calendar,
  UserPlus,
  Loader2,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { selectCurrentUser } from "@/store/slices/auth.slice";
import { groupService } from "@/lib/api/services/group.service";
import { ContactWithCustomFields } from "@/types/entities/group.types";

const PAGE_SIZE = 20;

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const groupId = params.id as string;
  const group = useAppSelector(selectCurrentGroup);
  const loading = useAppSelector(selectGroupsLoading);
  const user = useAppSelector(selectCurrentUser);
  const allContacts = useAppSelector(selectContacts);

  const isAdmin =
    user?.role === "CLIENT_ADMIN" || user?.role === "CLIENT_SUPER_ADMIN";

  // Add Contacts dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);

  // Table search
  const [tableSearch, setTableSearch] = useState("");
  const debouncedTableSearch = useDebounce(tableSearch, 400);

  // Paginated contacts state
  const [paginatedContacts, setPaginatedContacts] = useState<ContactWithCustomFields[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Track in-flight fetch to avoid stale updates when search changes rapidly
  const fetchIdRef = useRef(0);

  // Initial group metadata fetch
  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupById(groupId));
    }
    return () => {
      dispatch(clearCurrentGroup());
    };
  }, [groupId, dispatch]);

  // Fetch contacts whenever groupId or debouncedTableSearch changes
  useEffect(() => {
    if (!groupId) return;

    const currentFetchId = ++fetchIdRef.current;

    const loadInitial = async () => {
      setIsLoadingContacts(true);
      setPaginatedContacts([]);
      setNextCursor(null);

      try {
        const response = await groupService.getGroupContacts(groupId, {
          limit: PAGE_SIZE,
          search: debouncedTableSearch || undefined,
        });

        // Ignore stale responses if a newer fetch started
        if (currentFetchId !== fetchIdRef.current) return;

        setPaginatedContacts(response.contacts);
        setNextCursor(response.nextCursor);
      } catch {
        if (currentFetchId !== fetchIdRef.current) return;
        toast.error("Failed to load contacts");
      } finally {
        if (currentFetchId === fetchIdRef.current) {
          setIsLoadingContacts(false);
        }
      }
    };

    loadInitial();
  }, [groupId, debouncedTableSearch]);

  // Fetch all contacts when the add dialog opens
  useEffect(() => {
    if (addDialogOpen && allContacts.length === 0) {
      dispatch(fetchContacts({ limit: 1000 }));
    }
  }, [addDialogOpen, dispatch, allContacts.length]);

  // Load more contacts via cursor-based pagination
  const handleLoadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const response = await groupService.getGroupContacts(groupId, {
        limit: PAGE_SIZE,
        cursor: nextCursor,
        search: debouncedTableSearch || undefined,
      });
      setPaginatedContacts((prev) => [...prev, ...response.contacts]);
      setNextCursor(response.nextCursor);
    } catch {
      toast.error("Failed to load more contacts");
    } finally {
      setIsLoadingMore(false);
    }
  }, [groupId, nextCursor, isLoadingMore, debouncedTableSearch]);

  const totalCount = group?._count?.contactGroups ?? paginatedContacts.length;

  const existingContactIds = useMemo(
    () => new Set(paginatedContacts.map((c) => c.id)),
    [paginatedContacts],
  );

  // Filter contacts for the add dialog: exclude already-in-group, apply search
  const availableContacts = useMemo(() => {
    return allContacts
      .filter((c) => !existingContactIds.has(c.id))
      .filter(
        (c) =>
          !searchQuery ||
          c.email?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
  }, [allContacts, existingContactIds, searchQuery]);

  const handleToggleContact = (contactId: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId],
    );
  };

  const handleAddContacts = async () => {
    if (selectedContactIds.length === 0) return;
    setIsAssigning(true);
    try {
      await dispatch(
        assignContactsToGroup({ groupId, contactIds: selectedContactIds }),
      ).unwrap();
      toast.success(`Added ${selectedContactIds.length} contact(s) to group`);
      setAddDialogOpen(false);
      setSelectedContactIds([]);
      setSearchQuery("");
      // Re-fetch group metadata (count) and reset contacts list
      dispatch(fetchGroupById(groupId));
      // Trigger contacts reload by resetting paginated state — the useEffect will re-run
      setPaginatedContacts([]);
      setNextCursor(null);
      fetchIdRef.current++; // Invalidate any in-flight fetch
      const response = await groupService.getGroupContacts(groupId, {
        limit: PAGE_SIZE,
        search: debouncedTableSearch || undefined,
      });
      setPaginatedContacts(response.contacts);
      setNextCursor(response.nextCursor);
    } catch (err: unknown) {
      toast.error((err as string) || "Failed to add contacts");
    } finally {
      setIsAssigning(false);
    }
  };

  const isInitialLoading = loading && paginatedContacts.length === 0 && !isLoadingContacts;

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!group && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Group not found
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          The group you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
        <Button onClick={() => router.push("/client/groups")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Groups
        </Button>
      </div>
    );
  }

  const createdDate = group
    ? new Date(group.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

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
            <BreadcrumbPage>{group?.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-2xl">{group?.name}</CardTitle>
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3 w-3" />
                  {totalCount} {totalCount === 1 ? "contact" : "contacts"}
                </Badge>
              </div>

              <div className="flex items-center gap-2 mt-4 text-sm text-slate-600 dark:text-slate-400">
                <Calendar className="h-4 w-4" />
                <span>Created on {createdDate}</span>
              </div>
            </div>

            <Button
              onClick={() => router.push("/client/groups")}
              variant="outline"
              size="sm"
            >
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
                {paginatedContacts.length < totalCount
                  ? `Showing ${paginatedContacts.length} of ${totalCount} contacts`
                  : `Manage contacts in this group`}
              </CardDescription>
            </div>
            {isAdmin && (
              <Button
                onClick={() => setAddDialogOpen(true)}
                size="sm"
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add Contacts
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Table */}
          {isLoadingContacts ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : paginatedContacts.length === 0 && debouncedTableSearch ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No contacts found for &quot;{debouncedTableSearch}&quot;.
            </div>
          ) : (
            <ContactsTable data={paginatedContacts} groupId={groupId} />
          )}

          {/* Load More */}
          {!isLoadingContacts && nextCursor && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  `Load More (${paginatedContacts.length} of ${totalCount})`
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Contacts Dialog */}
      <Dialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) {
            setSelectedContactIds([]);
            setSearchQuery("");
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Contacts to {group?.name}</DialogTitle>
            <DialogDescription>
              Search and select contacts to add to this group.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto border rounded-md">
              {availableContacts.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  {searchQuery
                    ? "No matching contacts found."
                    : "All contacts are already in this group."}
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
              Add{" "}
              {selectedContactIds.length > 0
                ? `${selectedContactIds.length} Contact(s)`
                : "Contacts"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {totalCount}
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
              {paginatedContacts.filter((c) => c.customFieldValues?.length > 0).length}
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
              {paginatedContacts.reduce(
                (sum, c) => sum + (c.customFieldValues?.length || 0),
                0,
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



// 'use client';

// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import {
//   fetchGroupById,
//   clearCurrentGroup,
//   selectCurrentGroup,
//   selectGroupsLoading,
//   assignContactsToGroup,
// } from '@/store/slices/group.slice';
// import { fetchContacts, selectContacts } from '@/store/slices/contact.slice';
// import { ContactsTable } from '@/components/contacts/ContactsTable';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Checkbox } from '@/components/ui/checkbox';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from '@/components/ui/breadcrumb';
// import { ArrowLeft, Users, Calendar, UserPlus, Loader2, Search } from 'lucide-react';
// import { toast } from 'sonner';
// import { selectCurrentUser } from '@/store/slices/auth.slice';
// import { groupService } from '@/lib/api/services/group.service';
// import { ContactWithCustomFields } from '@/types/entities/group.types';

// const PAGE_SIZE = 20;

// export default function GroupDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const dispatch = useAppDispatch();

//   const groupId = params.id as string;
//   const group = useAppSelector(selectCurrentGroup);
//   const loading = useAppSelector(selectGroupsLoading);
//   const user = useAppSelector(selectCurrentUser);
//   const allContacts = useAppSelector(selectContacts);

//   const isAdmin = user?.role === 'CLIENT_ADMIN' || user?.role === 'CLIENT_SUPER_ADMIN';

//   // Add Contacts dialog state
//   const [addDialogOpen, setAddDialogOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
//   const [isAssigning, setIsAssigning] = useState(false);

//   // Paginated contacts state
//   const [paginatedContacts, setPaginatedContacts] = useState<ContactWithCustomFields[]>([]);
//   const [nextCursor, setNextCursor] = useState<string | null>(null);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [hasInitializedFromGroup, setHasInitializedFromGroup] = useState(false);

//   useEffect(() => {
//     if (groupId) {
//       dispatch(fetchGroupById(groupId));
//     }

//     return () => {
//       dispatch(clearCurrentGroup());
//       setPaginatedContacts([]);
//       setNextCursor(null);
//       setHasInitializedFromGroup(false);
//     };
//   }, [groupId, dispatch]);

//   // Seed paginated contacts from the initial group fetch (7 contacts inline)
//   // useEffect(() => {
//   //   if (group?.contactGroups && !hasInitializedFromGroup) {
//   //     const initialContacts = group.contactGroups.map((cg) => cg.contact);
//   //     setPaginatedContacts(initialContacts);
//   //     setHasInitializedFromGroup(true);

//   //     // If the group has more contacts than what was returned inline, there are more pages
//   //     const totalCount = group?._count?.contactGroups ?? initialContacts.length;
//   //     if (initialContacts.length < totalCount) {
//   //       // Set cursor to the last contact id so we can fetch more
//   //       const lastContact = initialContacts[initialContacts.length - 1];
//   //       setNextCursor(lastContact?.id ?? null);
//   //     } else {
//   //       setNextCursor(null);
//   //     }
//   //   }
//   // }, [group, hasInitializedFromGroup]);

//   useEffect(() => {
//   const loadInitial = async () => {
//     try {
//       const response = await groupService.getGroupContacts(groupId, {
//         limit: PAGE_SIZE,
//       });

//       setPaginatedContacts(response.contacts);
//       setNextCursor(response.nextCursor);
//     } catch {
//       toast.error('Failed to load contacts');
//     }
//   };

//   if (groupId) {
//     loadInitial();
//   }
// }, [groupId]);

//   // Fetch all contacts when the add dialog opens
//   useEffect(() => {
//     if (addDialogOpen && allContacts.length === 0) {
//       dispatch(fetchContacts({ limit: 1000 }));
//     }
//   }, [addDialogOpen, dispatch, allContacts.length]);

//   // Load more contacts via cursor-based pagination
//   const handleLoadMore = useCallback(async () => {
//     if (!nextCursor || isLoadingMore) return;
//     setIsLoadingMore(true);
//     try {
//       const response = await groupService.getGroupContacts(groupId, {
//         limit: PAGE_SIZE,
//         cursor: nextCursor,
//       });
//       setPaginatedContacts((prev) => [...prev, ...response.contacts]);
//       setNextCursor(response.nextCursor);
//     } catch {
//       toast.error('Failed to load more contacts');
//     } finally {
//       setIsLoadingMore(false);
//     }
//   }, [groupId, nextCursor, isLoadingMore]);

//   const totalCount = group?._count?.contactGroups ?? paginatedContacts.length;

//   const existingContactIds = useMemo(
//     () => new Set(paginatedContacts.map((c) => c.id)),
//     [paginatedContacts]
//   );

//   // Filter contacts for the add dialog: exclude already-in-group, apply search
//   const availableContacts = useMemo(() => {
//     return allContacts
//       .filter((c) => !existingContactIds.has(c.id))
//       .filter((c) =>
//         !searchQuery || c.email?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//   }, [allContacts, existingContactIds, searchQuery]);

//   const handleToggleContact = (contactId: string) => {
//     setSelectedContactIds((prev) =>
//       prev.includes(contactId)
//         ? prev.filter((id) => id !== contactId)
//         : [...prev, contactId]
//     );
//   };

//   const handleAddContacts = async () => {
//     if (selectedContactIds.length === 0) return;
//     setIsAssigning(true);
//     try {
//       await dispatch(
//         assignContactsToGroup({ groupId, contactIds: selectedContactIds })
//       ).unwrap();
//       toast.success(`Added ${selectedContactIds.length} contact(s) to group`);
//       setAddDialogOpen(false);
//       setSelectedContactIds([]);
//       setSearchQuery('');
//       // Reset and re-fetch group to get fresh contacts
//       setHasInitializedFromGroup(false);
//       setPaginatedContacts([]);
//       setNextCursor(null);
//       dispatch(fetchGroupById(groupId));
//     } catch (err: unknown) {
//       toast.error((err as string) || 'Failed to add contacts');
//     } finally {
//       setIsAssigning(false);
//     }
//   };

//   if (loading && paginatedContacts.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
//       </div>
//     );
//   }

//   if (!group) {
//     return (
//       <div className="flex flex-col items-center justify-center h-96">
//         <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
//           Group not found
//         </h2>
//         <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
//           The group you&apos;re looking for doesn&apos;t exist or has been deleted.
//         </p>
//         <Button onClick={() => router.push('/client/groups')} variant="outline">
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to Groups
//         </Button>
//       </div>
//     );
//   }

//   const createdDate = new Date(group.createdAt).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   });

//   return (
//     <div className="space-y-6">
//       {/* Breadcrumb */}
//       <Breadcrumb>
//         <BreadcrumbList>
//           <BreadcrumbItem>
//             <BreadcrumbLink href="/client/groups">Groups</BreadcrumbLink>
//           </BreadcrumbItem>
//           <BreadcrumbSeparator />
//           <BreadcrumbItem>
//             <BreadcrumbPage>{group.name}</BreadcrumbPage>
//           </BreadcrumbItem>
//         </BreadcrumbList>
//       </Breadcrumb>

//       {/* Header Card */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-start justify-between">
//             <div className="flex-1">
//               <div className="flex items-center gap-3 mb-2">
//                 <CardTitle className="text-2xl">{group.name}</CardTitle>
//                 <Badge variant="secondary" className="gap-1">
//                   <Users className="h-3 w-3" />
//                   {totalCount} {totalCount === 1 ? 'contact' : 'contacts'}
//                 </Badge>
//               </div>

//               <div className="flex items-center gap-2 mt-4 text-sm text-slate-600 dark:text-slate-400">
//                 <Calendar className="h-4 w-4" />
//                 <span>Created on {createdDate}</span>
//               </div>
//             </div>

//             <Button onClick={() => router.push('/client/groups')} variant="outline" size="sm">
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back
//             </Button>
//           </div>
//         </CardHeader>
//       </Card>

//       {/* Contacts Section */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Contacts</CardTitle>
//               <CardDescription>
//                 {paginatedContacts.length < totalCount
//                   ? `Showing ${paginatedContacts.length} of ${totalCount} contacts`
//                   : `Manage contacts in this group`}
//               </CardDescription>
//             </div>
//             {isAdmin && (
//               <Button onClick={() => setAddDialogOpen(true)} size="sm" className="gap-2">
//                 <UserPlus className="h-4 w-4" />
//                 Add Contacts
//               </Button>
//             )}
//           </div>
//         </CardHeader>
//         <CardContent>
//           <ContactsTable
//             data={paginatedContacts}
//             groupId={groupId}
//           />

//           {/* Load More */}
//           {nextCursor && (
//             <div className="flex justify-center mt-4">
//               <Button
//                 variant="outline"
//                 onClick={handleLoadMore}
//                 disabled={isLoadingMore}
//               >
//                 {isLoadingMore ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     Loading...
//                   </>
//                 ) : (
//                   `Load More (${paginatedContacts.length} of ${totalCount})`
//                 )}
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Add Contacts Dialog */}
//       <Dialog open={addDialogOpen} onOpenChange={(open) => {
//         setAddDialogOpen(open);
//         if (!open) {
//           setSelectedContactIds([]);
//           setSearchQuery('');
//         }
//       }}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Add Contacts to {group.name}</DialogTitle>
//             <DialogDescription>
//               Search and select contacts to add to this group.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4">
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by email..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-9"
//               />
//             </div>

//             {/* Contact list */}
//             <div className="max-h-[300px] overflow-y-auto border rounded-md">
//               {availableContacts.length === 0 ? (
//                 <div className="p-6 text-center text-sm text-muted-foreground">
//                   {searchQuery ? 'No matching contacts found.' : 'All contacts are already in this group.'}
//                 </div>
//               ) : (
//                 availableContacts.map((contact) => (
//                   <div
//                     key={contact.id}
//                     className="flex items-center gap-3 px-3 py-2 hover:bg-accent cursor-pointer border-b last:border-b-0"
//                     onClick={() => handleToggleContact(contact.id)}
//                   >
//                     <Checkbox
//                       checked={selectedContactIds.includes(contact.id)}
//                       onCheckedChange={() => handleToggleContact(contact.id)}
//                     />
//                     <span className="text-sm">{contact.email}</span>
//                   </div>
//                 ))
//               )}
//             </div>

//             {selectedContactIds.length > 0 && (
//               <p className="text-sm text-muted-foreground">
//                 {selectedContactIds.length} contact(s) selected
//               </p>
//             )}
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               onClick={handleAddContacts}
//               disabled={selectedContactIds.length === 0 || isAssigning}
//             >
//               {isAssigning && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
//               Add {selectedContactIds.length > 0 ? `${selectedContactIds.length} Contact(s)` : 'Contacts'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Statistics Card */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
//               Total Contacts
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
//               {totalCount}
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
//               With Custom Fields
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
//               {paginatedContacts.filter((c) => c.customFieldValues?.length > 0).length}
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
//               Total Custom Fields
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
//               {paginatedContacts.reduce((sum, c) => sum + (c.customFieldValues?.length || 0), 0)}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
