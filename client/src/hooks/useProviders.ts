import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { providerApi, type SearchParams, type ServiceProvider } from '@/lib/api';
import { toast } from 'sonner';

export function useProviderSearch(params: SearchParams) {
  return useQuery({
    queryKey: ['providers', 'search', params],
    queryFn: async () => {
      const response = await providerApi.search(params);
      return response.data;
    },
  });
}

export function useProvider(id: string | undefined) {
  return useQuery({
    queryKey: ['providers', id],
    queryFn: async () => {
      if (!id) throw new Error('Provider ID is required');
      const response = await providerApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useFilterOptions() {
  return useQuery({
    queryKey: ['providers', 'filters'],
    queryFn: async () => {
      const response = await providerApi.getFilters();
      return response.data;
    },
  });
}

export function useStatistics() {
  return useQuery({
    queryKey: ['providers', 'statistics'],
    queryFn: async () => {
      const response = await providerApi.getStatistics();
      return response.data;
    },
  });
}

export function useCreateProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<ServiceProvider, 'id' | 'createdAt' | 'updatedAt'>) =>
      providerApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      toast.success('Provider created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create provider');
    },
  });
}

export function useUpdateProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServiceProvider> }) =>
      providerApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      toast.success('Provider updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update provider');
    },
  });
}

export function useDeleteProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => providerApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      toast.success('Provider deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete provider');
    },
  });
}

export function useUploadExcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => providerApi.uploadExcel(file),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      toast.success(
        `Successfully imported ${response.data.imported} providers. Failed: ${response.data.failed}`
      );
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload file');
    },
  });
}

export function useClearAllProviders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => providerApi.clearAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      toast.success('All providers cleared successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to clear providers');
    },
  });
}

