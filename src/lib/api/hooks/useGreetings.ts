import { useQuery } from '@tanstack/react-query';
import { greetingService } from '../services/greeting.service';

export const useGreetings = () => {
  return useQuery({
    queryKey: ['greetings', 'active'],
    queryFn: () => greetingService.getActive(),
    refetchOnMount: 'always',
  });
};
