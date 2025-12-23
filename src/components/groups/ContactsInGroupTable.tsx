'use client';

import React, { useState } from 'react';
import { ContactWithCustomFields } from '@/types/entities/group.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Mail, UserMinus, ChevronDown, ChevronUp } from 'lucide-react';
import CustomFieldRenderer from '@/components/contacts/CustomFieldRenderer';
import { cn } from '@/lib/utils';

interface ContactsInGroupTableProps {
  contacts: ContactWithCustomFields[];
  onRemoveContact?: (contactId: string) => void;
  showActions?: boolean;
}

export function ContactsInGroupTable({ 
  contacts, 
  onRemoveContact, 
  showActions = true 
}: ContactsInGroupTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const filteredContacts = contacts.filter((contact) => {
    const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.toLowerCase();
    const email = contact.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  const toggleRow = (contactId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(contactId)) {
      newExpanded.delete(contactId);
    } else {
      newExpanded.add(contactId);
    }
    setExpandedRows(newExpanded);
  };

  const getContactName = (contact: ContactWithCustomFields) => {
    const firstName = contact.firstName || '';
    const lastName = contact.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Unnamed Contact';
  };

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
        <div className="rounded-full bg-white dark:bg-slate-800 p-4 mb-3">
          <Mail className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
          No contacts in this group
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Add contacts to this group to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search contacts by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">Custom Fields</TableHead>
              {showActions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showActions ? 5 : 4} className="text-center py-8 text-slate-500">
                  No contacts found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => {
                const isExpanded = expandedRows.has(contact.id);
                const hasCustomFields = contact.customFieldValues.length > 0;

                return (
                  <React.Fragment key={contact.id}>
                    <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-900">
                      <TableCell>
                        {hasCustomFields && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRow(contact.id)}
                            className="h-6 w-6 p-0"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {getContactName(contact)}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {contact.email}
                        </a>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-xs">
                          {contact.customFieldValues.length}
                        </Badge>
                      </TableCell>
                      {showActions && (
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveContact?.(contact.id)}
                            className="h-8 gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <UserMinus className="h-4 w-4" />
                            Remove
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                    
                    {/* Expanded Row - Custom Fields */}
                    {isExpanded && hasCustomFields && (
                      <TableRow>
                        <TableCell colSpan={showActions ? 5 : 4} className="bg-slate-50 dark:bg-slate-900">
                          <div className="py-4 px-6">
                            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                              Custom Fields
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {contact.customFieldValues.map((fieldValue) => (
                                <CustomFieldRenderer
                                  key={fieldValue.id}
                                  fieldValue={fieldValue}
                                />
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="text-sm text-slate-600 dark:text-slate-400">
        Showing {filteredContacts.length} of {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
