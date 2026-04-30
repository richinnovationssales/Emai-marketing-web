'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminDomainService } from '../services/adminDomain.service';
import { UpdateDomainRequest } from '@/types/entities/domain.types';
import { toast } from 'sonner';

export const adminDomainKeys = {
  all: ['admin-domain'] as const,
  config: (clientId: string) => [...adminDomainKeys.all, 'config', clientId] as const,
  history: (clientId: string) => [...adminDomainKeys.all, 'history', clientId] as const,
};

/**
 * Fetch domain configuration for a specific client (admin).
 * `refetchOnMount: 'always'` overrides the global default of `false` so
 * config/history reflect mutations performed on a different page. Without
 * it, the unmounted page misses the invalidate event and React Query
 * serves stale cache on remount.
 */
export const useAdminDomainConfig = (clientId: string) => {
  return useQuery({
    queryKey: adminDomainKeys.config(clientId),
    queryFn: () => adminDomainService.get(clientId),
    enabled: !!clientId,
    refetchOnMount: 'always',
  });
};

/**
 * Fetch domain change history for a specific client (admin).
 * Same reasoning as useAdminDomainConfig above.
 */
export const useAdminDomainHistory = (clientId: string) => {
  return useQuery({
    queryKey: adminDomainKeys.history(clientId),
    queryFn: () => adminDomainService.getHistory(clientId),
    enabled: !!clientId,
    refetchOnMount: 'always',
  });
};

/**
 * Update domain configuration for a specific client (admin)
 */
export const useAdminUpdateDomain = (clientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDomainRequest) => adminDomainService.update(clientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminDomainKeys.config(clientId) });
      queryClient.invalidateQueries({ queryKey: adminDomainKeys.history(clientId) });
      toast.success('Domain configuration updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update domain configuration');
    },
  });
};

/**
 * Remove domain configuration for a specific client (admin)
 */
export const useAdminRemoveDomain = (clientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminDomainService.remove(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminDomainKeys.config(clientId) });
      queryClient.invalidateQueries({ queryKey: adminDomainKeys.history(clientId) });
      toast.success('Domain configuration removed successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to remove domain configuration');
    },
  });
};
