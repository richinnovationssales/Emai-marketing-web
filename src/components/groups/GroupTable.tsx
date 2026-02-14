'use client';

import React, { useState } from 'react';
import { Group } from '@/types/entities/group.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Edit, Trash2, Search, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GroupTableProps {
  groups: Group[];
  onEdit?: (group: Group) => void;
  onDelete?: (group: Group) => void;
  showActions?: boolean;
}

export function GroupTable({ groups, onEdit, onDelete, showActions = true }: GroupTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (groupId: string) => {
    router.push(`/client/groups/${groupId}`);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              {/* <TableHead>Description</TableHead> */}
              <TableHead className="text-center">Contacts</TableHead>
              <TableHead>Created</TableHead>
              {showActions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showActions ? 5 : 4} className="text-center py-8 text-slate-500">
                  {searchTerm ? 'No groups found matching your search.' : 'No groups available.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredGroups.map((group) => (
                <TableRow key={group.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                  <TableCell className="font-medium" onClick={() => handleView(group.id)}>
                    {group.name}
                  </TableCell>
                  {/* <TableCell onClick={() => handleView(group.id)}>
                    <span className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                      {group.description || '-'}
                    </span>
                  </TableCell> */}
                  <TableCell className="text-center" onClick={() => handleView(group.id)}>
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      {group._count?.contactGroups ?? 0}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={() => handleView(group.id)}>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(group.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  {showActions && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(group.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(group);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(group);
                          }}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
