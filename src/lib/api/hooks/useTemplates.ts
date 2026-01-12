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

// Fetch all templates
export const useTemplates = (filters?: TemplateFilters) => {
  return useQuery({
    queryKey: templateKeys.list(filters),
    queryFn: () => templateService.getAll(filters),
  });
};

// Fetch single template by ID
export const useTemplate = (id: string) => {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => templateService.getById(id),
    enabled: !!id,
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
