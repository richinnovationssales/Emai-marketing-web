'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CreateGroupDTO, UpdateGroupDTO, Group } from '@/types/entities/group.types';
import { Loader2 } from 'lucide-react';

// Validation schema for group form
const groupFormSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100, 'Group name must be less than 100 characters'),
});

type GroupFormValues = z.infer<typeof groupFormSchema>;

interface GroupFormProps<T extends CreateGroupDTO | UpdateGroupDTO = CreateGroupDTO | UpdateGroupDTO> {
  group?: Group;
  onSubmit: (data: T) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function GroupForm<T extends CreateGroupDTO | UpdateGroupDTO = CreateGroupDTO | UpdateGroupDTO>({ group, onSubmit, onCancel, isLoading }: GroupFormProps<T>) {
  const isEditMode = !!group;

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: group?.name || '',
    },
  });

  // Reset form when group changes
  useEffect(() => {
    if (group) {
      form.reset({
        name: group.name,
      });
    }
  }, [group, form]);

  const handleSubmit = async (values: GroupFormValues) => {
    try {
      await onSubmit(values as T);
      if (!isEditMode) {
        form.reset();
      }
    } catch (error) {
      // Error handling is done in parent component
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Newsletter Subscribers"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                A descriptive name for your group
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the purpose of this group..."
                  className="resize-none"
                  rows={3}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Additional details about this group
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>{isEditMode ? 'Update Group' : 'Create Group'}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
