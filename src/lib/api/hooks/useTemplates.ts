'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { templateService } from '../services/template.service';
import { Template, CreateTemplateData, UpdateTemplateData, TemplateFilters } from '@/types/entities/template.types';
import { toast } from 'sonner';

// Query keys for cache management
export const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (filters?: TemplateFilters) => [...templateKeys.lists(), filters] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
};

// Fetch all templates.
// `refetchOnMount: 'always'` overrides the global default of `false` so the
// list refreshes after returning from create/edit/delete flows. Without
// this, invalidateQueries only marks the cache stale — and since the list
// page isn't mounted at the time, no refetch is queued; on remount React
// Query happily serves the stale cache.
export const useTemplates = (filters?: TemplateFilters) => {
  return useQuery({
    queryKey: templateKeys.list(filters),
    queryFn: () => templateService.getAll(filters),
    refetchOnMount: 'always',
  });
};

// Fetch single template by ID. Same reasoning as useTemplates above.
export const useTemplate = (id: string) => {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => templateService.getById(id),
    enabled: !!id,
    refetchOnMount: 'always',
  });
};

// Create template mutation
export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTemplateData) => templateService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      toast.success('Template created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create template');
    },
  });
};

// Update template mutation
export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTemplateData }) =>
      templateService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(variables.id) });
      toast.success('Template updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update template');
    },
  });
};

// Delete template mutation
export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => templateService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      toast.success('Template deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete template');
    },
  });
};
