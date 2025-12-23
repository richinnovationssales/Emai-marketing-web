'use client';

import React from 'react';
import { Users, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GroupsEmptyStateProps {
  onCreateClick?: () => void;
  showCreateButton?: boolean;
}

export function GroupsEmptyState({ onCreateClick, showCreateButton = true }: GroupsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-6 mb-4">
        <Users className="h-12 w-12 text-slate-400 dark:text-slate-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
        No groups yet
      </h3>
      
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-sm mb-6">
        Groups help you organize your contacts. Create your first group to get started.
      </p>
      
      {showCreateButton && onCreateClick && (
        <Button onClick={onCreateClick} className="gap-2">
          <FolderPlus className="h-4 w-4" />
          Create Your First Group
        </Button>
      )}
    </div>
  );
}
