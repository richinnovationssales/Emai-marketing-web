'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { toast } from 'sonner';
import { Users, UserMinus, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';

// UI Components (Shadcn/UI)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Redux Actions & Selectors
import { bulkDeleteContacts } from '@/store/slices/contact.slice';
import {
  assignContactsToGroup,
  removeContactsFromGroup,
  fetchGroups,
  selectGroups,
} from '@/store/slices/group.slice';
import { BaseContact } from '@/types/entities/contact.types';

interface ContactsTableProps {
  data: BaseContact[];
  onDelete?: (id: string) => void;
  groupId?: string;
}

export function ContactsTable({ data, onDelete, groupId }: ContactsTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const groups = useSelector(selectGroups);

  // --- STATE ---
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddToGroupOpen, setIsAddToGroupOpen] = useState(false);
  const [targetGroupId, setTargetGroupId] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(data.length / rowsPerPage);
  
//   const paginatedData = useMemo(() => {
//     const start = (currentPage - 1) * rowsPerPage;
//     return data.slice(start, start + rowsPerPage);
//   }, [data, currentPage, rowsPerPage]);
const safeData = useMemo(
  () => data.filter((c): c is BaseContact => Boolean(c?.id)),
  [data]
);

const paginatedData = useMemo(() => {
  const start = (currentPage - 1) * rowsPerPage;
  return safeData.slice(start, start + rowsPerPage);
}, [safeData, currentPage, rowsPerPage]);


  // Reset to first page if data changes (e.g. filtered or deleted)
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  // --- SELECTION LOGIC ---
  const isPageFullySelected =
    paginatedData.length > 0 &&
    paginatedData.every((c) => selectedIds.includes(c.id));

  const handleSelectAll = (checked: boolean) => {
    const pageIds = paginatedData.map((c) => c.id);
    if (checked) {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    }
  };

  // --- ACTIONS ---
  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedIds.length} contact(s)?`)) {
      dispatch(bulkDeleteContacts(selectedIds));
      setSelectedIds([]);
      toast.success('Contacts deleted successfully');
    }
  };

  const handleSingleDelete = (id: string) => {
    const message = groupId 
      ? 'Remove contact from group?' 
      : 'Delete this contact permanently?';
    
    if (window.confirm(message)) {
      if (groupId) {
        dispatch(removeContactsFromGroup({ groupId, contactIds: [id] }))
          .unwrap()
          .then(() => toast.success('Removed from group'))
          .catch(() => toast.error('Failed to remove'));
      } else {
        dispatch(bulkDeleteContacts([id]));
        onDelete?.(id);
      }
    }
  };

  // Helper to extract nested/custom field values
  const getFieldValue = (contact: any, field: string) => {
    const val = contact[field] || contact.customFields?.[field];
    return typeof val === 'object' ? val?.value : val;
  };

  return (
    <div className="space-y-4">
      {/* BULK ACTIONS BAR */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-secondary/50 p-2 px-4 rounded-lg border animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium">{selectedIds.length} selected</span>
          <div className="flex gap-2">
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
            {groupId && (
              <Button variant="outline" size="sm" onClick={() => /* logic */ null}>
                <UserMinus className="h-4 w-4 mr-2" /> Remove from Group
              </Button>
            )}
          </div>
        </div>
      )}

      {/* MAIN TABLE */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={isPageFullySelected} 
                  onCheckedChange={(val) => handleSelectAll(!!val)} 
                />
              </TableHead>
              <TableHead>Group </TableHead>
              <TableHead>Email</TableHead>
              {/* <TableHead>Phone</TableHead> */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No contacts found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(contact.id)}
                      onCheckedChange={(val) => handleSelectRow(contact.id, !!val)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {getFieldValue(contact, 'groupName')} {getFieldValue(contact, 'lastName')}
                  </TableCell>
                  <TableCell>{getFieldValue(contact, 'email')}</TableCell>
                  {/* <TableCell>{getFieldValue(contact, 'phone') || '-'}</TableCell> */}
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/client/contacts/${contact.id}/edit`}>
                        <Edit2 className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive" 
                      onClick={() => handleSingleDelete(contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
          <div className="text-sm text-muted-foreground order-2 sm:order-1">
            Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, data.length)} of {data.length} contacts
          </div>

          <div className="flex items-center gap-2 sm:gap-6 order-1 sm:order-2">
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap">Rows per page</span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={(v) => {
                  setRowsPerPage(Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50].map((size) => (
                    <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium px-2">
                {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 'use client';

// import { BaseContact, Contact } from '@/types/entities/contact.types';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from '@/store';
// import { bulkDeleteContacts, setSelectedContact } from '@/store/slices/contact.slice';
// import { assignContactsToGroup, removeContactsFromGroup, fetchGroups, selectGroups } from '@/store/slices/group.slice';
// import Link from 'next/link';
// import { Checkbox } from '@/components/ui/checkbox';
// import { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { toast } from 'sonner';
// import { Users, UserMinus, Trash2, Edit2 } from 'lucide-react';

// interface ContactsTableProps {
//     data: BaseContact[];
//     onDelete?: (id: string) => void;
//     groupId?: string; // If present, we are in a group context
// }

// export function ContactsTable({ data, onDelete, groupId }: ContactsTableProps) {
//     const dispatch = useDispatch<AppDispatch>();
//     const [selectedIds, setSelectedIds] = useState<string[]>([]);
//     const [isAddToGroupOpen, setIsAddToGroupOpen] = useState(false);
//     const [targetGroupId, setTargetGroupId] = useState<string>('');
//     const groups = useSelector(selectGroups);

//     useEffect(() => {
//         if (isAddToGroupOpen && groups.length === 0) {
//             dispatch(fetchGroups());
//         }
//     }, [isAddToGroupOpen, dispatch, groups.length]);

//     const handleSelectAll = (checked: boolean) => {
//         if (checked) {
//             setSelectedIds(data.map(c => c.id));
//         } else {
//             setSelectedIds([]);
//         }
//     };

//     const handleSelectRow = (id: string, checked: boolean) => {
//         if (checked) {
//             setSelectedIds(prev => [...prev, id]);
//         } else {
//             setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
//         }
//     };

//     const handleBulkDelete = () => {
//         if (confirm(`Are you sure you want to delete ${selectedIds.length} contact(s)?`)) {
//             dispatch(bulkDeleteContacts(selectedIds));
//             setSelectedIds([]);
//         }
//     };
    
//     // Override single delete to use bulk delete logic for consistency if preferred, 
//     // or just keep using the props. But user asked for consistency and use bulk delete api.
//     const handleSingleDelete = (id: string) => {
//         if (groupId) {
//              if (confirm('Are you sure you want to remove this contact from the group?')) {
//                 dispatch(removeContactsFromGroup({ groupId, contactIds: [id] })).unwrap()
//                     .then(() => toast.success('Contact removed from group'))
//                     .catch((err) => toast.error(err || 'Failed to remove contact'));
//              }
//         } else {
//              if (confirm('Are you sure you want to delete this contact?')) {
//                 // Uses bulk delete logic for consistency
//                 dispatch(bulkDeleteContacts([id]));
//                 onDelete?.(id); 
//             }
//         }
//     };

//     const handleAddToGroup = async () => {
//         if (!targetGroupId) return;
//         try {
//             await dispatch(assignContactsToGroup({ groupId: targetGroupId, contactIds: selectedIds })).unwrap();
//             toast.success(`added ${selectedIds.length} contact(s) to group`);
//             setIsAddToGroupOpen(false);
//             setTargetGroupId('');
//             setSelectedIds([]);
//         } catch (err: any) {
//              toast.error(err || 'Failed to add contacts to group');
//         }
//     };

//     const handleRemoveFromGroup = async () => {
//         if (!groupId) return;
//         if (confirm(`Are you sure you want to remove ${selectedIds.length} contact(s) from this group?`)) {
//             try {
//                 await dispatch(removeContactsFromGroup({ groupId, contactIds: selectedIds })).unwrap();
//                 toast.success(`Removed ${selectedIds.length} contact(s) from group`);
//                 setSelectedIds([]);
//                 // Trigger refresh or assume store updates? Store update should handle it if listening to generic events or manual refresh needed.
//                 // ideally fetchGroupById again?
//             } catch (err: any) {
//                 toast.error(err || 'Failed to remove contacts from group');
//             }
//         }
//     };

//     return (
//         <div className="space-y-4">
//             {selectedIds.length > 0 && (
//                 <div className="flex items-center justify-between bg-muted/50 p-2 px-4 rounded-md border">
//                     <span className="text-sm font-medium">{selectedIds.length} selected</span>
//                     <div className="flex gap-2">
//                         <Button 
//                             variant="destructive" 
//                             size="sm"
//                             onClick={handleBulkDelete}
//                         >
//                             Delete Selected
//                         </Button>
//                         {!groupId && (
//                             <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => setIsAddToGroupOpen(true)}
//                                 className="gap-2"
//                             >
//                                 <Users className="h-4 w-4" />
//                                 Add to Group
//                             </Button>
//                         )}
//                         {groupId && (
//                             <Button
//                                 variant="destructive"
//                                 size="sm"
//                                 onClick={handleRemoveFromGroup}
//                                 className="gap-2"
//                             >
//                                 <UserMinus className="h-4 w-4" />
//                                 Remove from Group
//                             </Button>
//                         )}
//                     </div>
//                 </div>
//             )}
            
//             <Dialog open={isAddToGroupOpen} onOpenChange={setIsAddToGroupOpen}>
//                 <DialogContent className="sm:max-w-[425px]">
//                     <DialogHeader>
//                         <DialogTitle>Add to Group</DialogTitle>
//                         <DialogDescription>
//                             Add {selectedIds.length} selected contact(s) to a group.
//                         </DialogDescription>
//                     </DialogHeader>
//                     <div className="grid gap-4 py-4">
//                         <div className="grid grid-cols-4 items-center gap-4">
//                             <Label htmlFor="group" className="text-right">
//                                 Group
//                             </Label>
//                             <Select onValueChange={setTargetGroupId} value={targetGroupId}>
//                                 <SelectTrigger className="col-span-3">
//                                     <SelectValue placeholder="Select a group" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {groups.map((g) => (
//                                         <SelectItem key={g.id} value={g.id}>
//                                             {g.name}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>
//                     <DialogFooter>
//                         <Button type="submit" onClick={handleAddToGroup} disabled={!targetGroupId}>
//                             Add to Group
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//             <div className="rounded-md border">
//             <Table>
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead className="w-[50px]">
//                             <Checkbox 
//                                 checked={data.length > 0 && selectedIds.length === data.length}
//                                 onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
//                             />
//                         </TableHead>
//                         <TableHead>Name</TableHead>
//                         <TableHead>Email</TableHead>
//                         <TableHead>Phone</TableHead>
//                         <TableHead>Group</TableHead>
//                         <TableHead className="text-right">Actions</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {data?.length === 0 ? (
//                         <TableRow>
//                             <TableCell colSpan={5} className="h-24 text-center">
//                                 No contacts found.
//                             </TableCell>
//                         </TableRow>
//                     ) : (
//                         data.map((contact) => {
//                              if (!contact) return null;
                             
//                              // Helper to get field value from root or customFields
//                              const getFieldValue = (field: string) => {
//                                  const rootVal = (contact as any)[field];
//                                  if (rootVal) return rootVal;
                                 
//                                  // Check simple key in customFields
//                                  if (contact.customFields && contact.customFields[field]) {
//                                      // If it's a simple value
//                                      if (typeof contact.customFields[field] !== 'object') {
//                                          return contact.customFields[field];
//                                      }
//                                      // If its the complex object { value: "...", ... }
//                                      return contact.customFields[field]?.value;
//                                  }
//                                  return '';
//                              };

//                              const firstName = getFieldValue('firstName');
//                              const lastName = getFieldValue('lastName');
//                              const email = getFieldValue('email'); // Email should be root, but just in case
//                              const phone = getFieldValue('phone') || getFieldValue('phoneNumber'); // Handle phone/phoneNumber variance

//                             return (
//                                 <TableRow key={contact?.id}>
//                                 <TableCell>
//                                     <Checkbox 
//                                         checked={selectedIds.includes(contact.id)}
//                                         onCheckedChange={(checked) => handleSelectRow(contact.id, checked as boolean)}
//                                     />
//                                 </TableCell>
//                                 <TableCell className="font-medium">
//                                         {firstName} {lastName}
//                                     </TableCell>
//                                     <TableCell>{email}</TableCell>
//                                     <TableCell>{phone || '-'}</TableCell>
//                                         <TableCell>{contact?.groupName || '-'}</TableCell>
//                                     <TableCell className="text-right space-x-2">
//                                         <Link href={`/client/contacts/${contact?.id}/edit`} >
//                                             <Button variant="ghost" size="icon" className="h-8 w-8">
//                                                 <Edit2 className="h-4 w-4" />
//                                             </Button>
//                                         </Link>
//                                         <Button 
//                                             variant="ghost" 
//                                             size="icon" 
//                                             className="h-8 w-8 text-destructive hover:text-destructive"
//                                             onClick={() => handleSingleDelete(contact?.id)}
//                                         >
//                                             <Trash2 className="h-4 w-4" />
//                                         </Button>
//                                     </TableCell>
//                                 </TableRow>
//                             );
//                         })
//                     )}
//                 </TableBody>
//             </Table>
//             </div>
//         </div>
//     );
// }
