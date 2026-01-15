'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { domainService } from '../services/domain.service';
import { UpdateDomainRequest } from '@/types/entities/domain.types';
import { toast } from 'sonner';

// Query keys for cache management
export const domainKeys = {
  all: ['domain'] as const,
  config: () => [...domainKeys.all, 'config'] as const,
  history: () => [...domainKeys.all, 'history'] as const,
};

/**
 * Fetch current domain configuration
 */
export const useDomainConfig = () => {
  return useQuery({
    queryKey: domainKeys.config(),
    queryFn: () => domainService.get(),
  });
};

/**
 * Fetch domain change history
 */
export const useDomainHistory = () => {
  return useQuery({
    queryKey: domainKeys.history(),
    queryFn: () => domainService.getHistory(),
  });
};

/**
 * Update domain configuration mutation
 */
export const useUpdateDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDomainRequest) => domainService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: domainKeys.config() });
      queryClient.invalidateQueries({ queryKey: domainKeys.history() });
      toast.success('Domain configuration updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update domain configuration');
    },
  });
};

/**
 * Remove domain configuration mutation
 */
export const useRemoveDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => domainService.remove(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: domainKeys.config() });
      queryClient.invalidateQueries({ queryKey: domainKeys.history() });
      toast.success('Domain configuration removed successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to remove domain configuration');
    },
  });
};
