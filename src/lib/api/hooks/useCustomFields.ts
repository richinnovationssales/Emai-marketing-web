import { useQuery } from '@tanstack/react-query';
import { customFieldService } from '../services/custom-field.service';

export const useCustomFields = (options?: { includeInactive?: boolean }) => {
  return useQuery({
    queryKey: ['customFields', options],
    queryFn: () => customFieldService.getAll(options),
    select: (data) => data.data,
  });
};

export const useNameFields = () => {
  return useQuery({
    queryKey: ['customFields', 'nameFields'],
    queryFn: () => customFieldService.getAll(),
    select: (data) => data.data.filter((f) => f.isNameField),
  });
};
