'use client';

import React from 'react';
import { Group } from '@/types/entities/group.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Edit, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface GroupCardProps {
  group: Group;
  onEdit?: (group: Group) => void;
  onDelete?: (group: Group) => void;
  showActions?: boolean;
  className?: string;
}

export function GroupCard({ group, onEdit, onDelete, showActions = true, className }: GroupCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/client/groups/${group.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(group);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(group);
  };

  const contactCount = group._count?.contacts ?? 0;
  const createdDate = new Date(group.createdAt).toLocaleDateString();

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600',
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate mb-2">
              {group.name}
            </h3>
            
            {group.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                {group.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>
                  {contactCount} {contactCount === 1 ? 'contact' : 'contacts'}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{createdDate}</span>
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex items-center gap-1 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
