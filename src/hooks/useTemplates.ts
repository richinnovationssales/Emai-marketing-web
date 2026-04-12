import apiClient from "@/lib/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTemplate(id: string) {
  return useQuery({
    queryKey: ['template', id],
    queryFn: () => apiClient.get(`/templates/${id}`).then(r => r.data),
    enabled: !!id,
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      apiClient.put(`/templates/${id}`, data).then(r => r.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.invalidateQueries({ queryKey: ['template', id] });
    },
  });
}