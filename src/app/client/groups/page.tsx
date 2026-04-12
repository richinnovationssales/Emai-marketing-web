'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  selectGroups,
  selectGroupsLoading,
  selectGroupActionLoading,
} from '@/store/slices/group.slice';
import { Group, CreateGroupData, UpdateGroupData } from '@/types/entities/group.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { GroupCard } from '@/components/groups/GroupCard';
import { GroupTable } from '@/components/groups/GroupTable';
import { GroupsEmptyState } from '@/components/groups/GroupsEmptyState';
import { FolderPlus, LayoutGrid, List, Loader2, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { selectCurrentUser } from '@/store/slices/auth.slice';
import GroupForm from '@/components/groups/GroupForm';

type ViewMode = 'grid' | 'table';

export default function GroupsPage() {
  const dispatch = useAppDispatch();
  const groups = useAppSelector(selectGroups);
  const loading = useAppSelector(selectGroupsLoading);
  const actionLoading = useAppSelector(selectGroupActionLoading);
  const user = useAppSelector(selectCurrentUser);

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const isAdmin = user?.role === 'CLIENT_ADMIN' || user?.role === 'CLIENT_SUPER_ADMIN';
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    dispatch(fetchGroups());
  }, [dispatch]);

  // Client-side filtering — groups are fully loaded, no API call needed
  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q)
    );
  }, [groups, searchQuery]);

  const handleCreateGroup = async (data: CreateGroupData) => {
    try {
      await dispatch(createGroup(data)).unwrap();
      toast.success('Group created successfully');
      setCreateDialogOpen(false);
    } catch (error: any) {
      toast.error(error || 'Failed to create group');
    }
  };

  const handleUpdateGroup = async (data: UpdateGroupData) => {
    if (!selectedGroup) return;
    try {
      await dispatch(updateGroup({ id: selectedGroup.id, data })).unwrap();
      toast.success('Group updated successfully');
      setEditDialogOpen(false);
      setSelectedGroup(null);
    } catch (error: any) {
      toast.error(error || 'Failed to update group');
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;
    try {
      await dispatch(deleteGroup(selectedGroup.id)).unwrap();
      toast.success('Group deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedGroup(null);
    } catch (error: any) {
      toast.error(error || 'Failed to delete group');
    }
  };

  const openEditDialog = (group: Group) => {
    setSelectedGroup(group);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (group: Group) => {
    setSelectedGroup(group);
    setDeleteDialogOpen(true);
  };

  if (loading && groups.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const hasGroups = groups.length > 0;
  const hasResults = filteredGroups.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Groups</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Organize your contacts into groups for targeted campaigns
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasGroups && (
            <div className="flex items-center border rounded-lg p-1 bg-slate-50 dark:bg-slate-900">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 px-3"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="h-8 px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}

          {isAdmin && (
            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
              <FolderPlus className="h-4 w-4" />
              Create Group
            </Button>
          )}
        </div>
      </div>

      {/* Search bar — only shown when there are groups to search */}
      {hasGroups && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {!hasGroups ? (
        <GroupsEmptyState
          onCreateClick={isAdmin ? () => setCreateDialogOpen(true) : undefined}
          showCreateButton={isAdmin}
        />
      ) : !hasResults ? (
        // No results for current search
        <div className="flex flex-col items-center justify-center h-48 text-center gap-2">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No groups match <span className="font-medium">"{searchQuery}"</span>
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={isAdmin ? openEditDialog : undefined}
              onDelete={isAdmin ? openDeleteDialog : undefined}
              showActions={isAdmin}
            />
          ))}
        </div>
      ) : (
        <GroupTable
          groups={filteredGroups}
          onEdit={isAdmin ? openEditDialog : undefined}
          onDelete={isAdmin ? openDeleteDialog : undefined}
          showActions={isAdmin}
        />
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>Create a new group to organize your contacts</DialogDescription>
          </DialogHeader>
          <GroupForm<CreateGroupData>
            onSubmit={handleCreateGroup}
            onCancel={() => setCreateDialogOpen(false)}
            isLoading={actionLoading?.create}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>Update the group information</DialogDescription>
          </DialogHeader>
          <GroupForm<UpdateGroupData>
            group={selectedGroup || undefined}
            onSubmit={handleUpdateGroup}
            onCancel={() => {
              setEditDialogOpen(false);
              setSelectedGroup(null);
            }}
            isLoading={actionLoading?.update}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the group "{selectedGroup?.name}". This action cannot be undone.
              Contacts in this group will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedGroup(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              className="bg-red-600 hover:bg-red-700"
              disabled={actionLoading?.delete}
            >
              {actionLoading?.delete ? 'Deleting...' : 'Delete Group'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// 'use client';

// import React, { useEffect, useRef, useState } from 'react';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import {
//   fetchGroups,
//   createGroup,
//   updateGroup,
//   deleteGroup,
//   selectGroups,
//   selectGroupsLoading,
//   selectGroupActionLoading,
//   clearError,
// } from '@/store/slices/group.slice';
// import { Group, CreateGroupData, UpdateGroupData } from '@/types/entities/group.types';
// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import { GroupCard } from '@/components/groups/GroupCard';
// import { GroupTable } from '@/components/groups/GroupTable';
// import { GroupsEmptyState } from '@/components/groups/GroupsEmptyState';
// import { FolderPlus, LayoutGrid, List, Loader2 } from 'lucide-react';
// import { toast } from 'sonner';
// import { cn } from '@/lib/utils';
// import { selectCurrentUser } from '@/store/slices/auth.slice';
// import GroupForm from '@/components/groups/GroupForm';

// type ViewMode = 'grid' | 'table';

// export default function GroupsPage() {
//   const dispatch = useAppDispatch();
//   const groups = useAppSelector(selectGroups);
//   const loading = useAppSelector(selectGroupsLoading);
//   const actionLoading = useAppSelector(selectGroupActionLoading);
//   const user = useAppSelector(selectCurrentUser);

//   const [viewMode, setViewMode] = useState<ViewMode>('grid');
//   const [createDialogOpen, setCreateDialogOpen] = useState(false);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

//   // Check if user has admin permissions
//   const isAdmin = user?.role === 'CLIENT_ADMIN' || user?.role === 'CLIENT_SUPER_ADMIN';
//   const fetchedRef = useRef(false);

//   useEffect(() => {
//     if (fetchedRef.current) return;
//     fetchedRef.current = true;
//     dispatch(fetchGroups());

    
//   }, [dispatch]);

//   useEffect(() => {
//   console.log('Groups from store:', groups);
// }, [groups]);

//   const handleCreateGroup = async (data: CreateGroupData) => {
//     try {
//       await dispatch(createGroup(data)).unwrap();
//       toast.success('Group created successfully');
//       setCreateDialogOpen(false);
//     } catch (error: any) {
//       toast.error(error || 'Failed to create group');
//     }
//   };

//   const handleUpdateGroup = async (data: UpdateGroupData) => {
//     if (!selectedGroup) return;
    
//     try {
//       await dispatch(updateGroup({ id: selectedGroup.id, data })).unwrap();
//       toast.success('Group updated successfully');
//       setEditDialogOpen(false);
//       setSelectedGroup(null);
//     } catch (error: any) {
//       toast.error(error || 'Failed to update group');
//     }
//   };

//   const handleDeleteGroup = async () => {
//     if (!selectedGroup) return;

//     try {
//       await dispatch(deleteGroup(selectedGroup.id)).unwrap();
//       toast.success('Group deleted successfully');
//       setDeleteDialogOpen(false);
//       setSelectedGroup(null);
//     } catch (error: any) {
//       toast.error(error || 'Failed to delete group');
//     }
//   };

//   const openEditDialog = (group: Group) => {
//     setSelectedGroup(group);
//     setEditDialogOpen(true);
//   };

//   const openDeleteDialog = (group: Group) => {
//     setSelectedGroup(group);
//     setDeleteDialogOpen(true);
//   };

//   if (loading && groups.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Groups</h1>
//           <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
//             Organize your contacts into groups for targeted campaigns
//           </p>
//         </div>

//         <div className="flex items-center gap-2">
//           {/* View Mode Toggle */}
//           {groups.length > 0 && (
//             <div className="flex items-center border rounded-lg p-1 bg-slate-50 dark:bg-slate-900">
//               <Button
//                 variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
//                 size="sm"
//                 onClick={() => setViewMode('grid')}
//                 className="h-8 px-3"
//               >
//                 <LayoutGrid className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant={viewMode === 'table' ? 'secondary' : 'ghost'}
//                 size="sm"
//                 onClick={() => setViewMode('table')}
//                 className="h-8 px-3"
//               >
//                 <List className="h-4 w-4" />
//               </Button>
//             </div>
//           )}

//           {/* Create Button */}
//           {isAdmin && (
//             <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
//               <FolderPlus className="h-4 w-4" />
//               Create Group
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Content */}
//       {groups.length === 0 ? (
//         <GroupsEmptyState
//           onCreateClick={isAdmin ? () => setCreateDialogOpen(true) : undefined}
//           showCreateButton={isAdmin}
//         />
//       ) : viewMode === 'grid' ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {groups.map((group) => (
//             <GroupCard
//               key={group.id}
//               group={group}
//               onEdit={isAdmin ? openEditDialog : undefined}
//               onDelete={isAdmin ? openDeleteDialog : undefined}
//               showActions={isAdmin}
//             />
//           ))}
//         </div>
//       ) : (
//         <GroupTable
//           groups={groups}
//           onEdit={isAdmin ? openEditDialog : undefined}
//           onDelete={isAdmin ? openDeleteDialog : undefined}
//           showActions={isAdmin}
//         />
//       )}

//       {/* Create Dialog */}
//       <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Create New Group</DialogTitle>
//             <DialogDescription>
//               Create a new group to organize your contacts
//             </DialogDescription>
//           </DialogHeader>
//           <GroupForm<CreateGroupData>
//             onSubmit={handleCreateGroup}
//             onCancel={() => setCreateDialogOpen(false)}
//             isLoading={actionLoading?.create}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* Edit Dialog */}
//       <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit Group</DialogTitle>
//             <DialogDescription>
//               Update the group information
//             </DialogDescription>
//           </DialogHeader>
//           <GroupForm<UpdateGroupData>
//             group={selectedGroup || undefined}
//             onSubmit={handleUpdateGroup}
//             onCancel={() => {
//               setEditDialogOpen(false);
//               setSelectedGroup(null);
//             }}
//             isLoading={actionLoading?.update}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will permanently delete the group "{selectedGroup?.name}". This action cannot be undone.
//               Contacts in this group will not be deleted.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={() => setSelectedGroup(null)}>
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDeleteGroup}
//               className="bg-red-600 hover:bg-red-700"
//               disabled={actionLoading?.delete}
//             >
//               {actionLoading?.delete ? 'Deleting...' : 'Delete Group'}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }