import { useQuery } from '@tanstack/react-query';
import { customFieldService } from '../services/custom-field.service';

// `refetchOnMount: 'always'` overrides the global default of `false` so the
// list reflects mutations performed on a different page (e.g. create →
// list). Without it, the unmounted list misses the invalidate event and
// React Query serves stale cache on remount.
export const useCustomFields = (options?: { includeInactive?: boolean }) => {
  return useQuery({
    queryKey: ['customFields', options],
    queryFn: () => customFieldService.getAll(options),
    select: (data) => data.data,
    refetchOnMount: 'always',
  });
};

export const useNameFields = () => {
  return useQuery({
    queryKey: ['customFields', 'nameFields'],
    queryFn: () => customFieldService.getAll(),
    select: (data) => data.data.filter((f) => f.isNameField),
    refetchOnMount: 'always',
  });
};
