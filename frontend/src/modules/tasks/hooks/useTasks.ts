import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/client';

export function useTasksList(params: { query?: string; category?: string; sort?: string }) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: async () => {
      let url = '/api/v1/tasks';
      if (params.query) url = `/api/v1/tasks/search?query=${encodeURIComponent(params.query)}`;
      else if (params.category) url = `/api/v1/tasks/category/${encodeURIComponent(params.category)}`;
      else if (params.sort === 'deadline-asc') url = '/api/v1/tasks/sort/deadline';
      else if (params.sort === 'priority') url = '/api/v1/tasks/sort/priority';
      else if (params.sort === 'created') url = '/api/v1/tasks/sort/created';
      else if (params.sort === 'time') url = '/api/v1/tasks/sort/time-required';
      const res = await api.get(url);
      return res.data.data as any[];
    },
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => (await api.post('/api/v1/tasks', payload)).data.data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => (await api.patch(`/api/v1/tasks/${id}`, payload)).data.data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/api/v1/tasks/${id}`)).data.data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); },
  });
}
