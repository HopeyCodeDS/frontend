import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { landsideAPI, getFallbackData } from '@/services/apiService';
import { Truck, TruckFilters, TruckStatus } from '@/types';

export function useTruckData() {
  const [filters, setFilters] = useState<TruckFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20
  });

  const queryClient = useQueryClient();

  // Fetch trucks with React Query
  const {
    data: trucksResponse,
    isLoading: loading,
    error: queryError,
    refetch: fetchTrucks
  } = useQuery({
    queryKey: ['trucks', filters, pagination.page, pagination.limit],
    queryFn: async () => {
      try {
        const response = await landsideAPI.getTrucks(
          filters, 
          pagination.page, 
          pagination.limit
        );
        
        if (response && response.success) {
          return response;
        } else {
          // Fallback to mock data
          const fallbackData = getFallbackData('trucks') as Truck[];
          return {
            data: fallbackData,
            pagination: {
              total: fallbackData.length,
              pages: Math.ceil(fallbackData.length / pagination.limit),
              page: pagination.page,
              limit: pagination.limit
            },
            success: true
          };
        }
      } catch (err) {
        // Fallback to mock data on error
        const fallbackData = getFallbackData('trucks') as Truck[];
        return {
          data: fallbackData,
          pagination: {
            total: fallbackData.length,
            pages: Math.ceil(fallbackData.length / pagination.limit),
            page: pagination.page,
            limit: pagination.limit
          },
          success: true
        };
      }
    },
    staleTime: 30000, // Data is fresh for 30 seconds
    refetchInterval: 15000, // Refetch every 15 seconds
    retry: 3,
    retryDelay: 1000
  });

  // Extract data and pagination from response
  const trucks = trucksResponse?.data || [];
  const paginationData = trucksResponse?.pagination || {
    total: 0,
    pages: 0,
    page: pagination.page,
    limit: pagination.limit
  };
  const error = queryError ? (queryError as Error).message : null;

  // CRUD mutations with React Query
  const createTruckMutation = useMutation({
    mutationFn: async (truckData: Partial<Truck>) => {
      const response = await landsideAPI.createTruck(truckData);
      if (!response?.success) {
        throw new Error('Failed to create truck');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch trucks data
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
    },
    onError: (error) => {
      console.error('Failed to create truck:', error);
    }
  });

  const updateTruckMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Truck> }) => {
      const response = await landsideAPI.updateTruck(id, updates);
      if (!response?.success) {
        throw new Error('Failed to update truck');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch trucks data
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
    },
    onError: (error) => {
      console.error('Failed to update truck:', error);
    }
  });

  const deleteTruckMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await landsideAPI.deleteTruck(id);
      if (!response?.success) {
        throw new Error('Failed to delete truck');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch trucks data
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
    },
    onError: (error) => {
      console.error('Failed to delete truck:', error);
    }
  });

  const updateTruckStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TruckStatus }) => {
      const response = await landsideAPI.updateTruckStatus(id, status);
      if (!response?.success) {
        throw new Error('Failed to update truck status');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch trucks data
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
    },
    onError: (error) => {
      console.error('Failed to update truck status:', error);
    }
  });

  // CRUD operation functions
  const createTruck = async (truckData: Partial<Truck>): Promise<boolean> => {
    try {
      await createTruckMutation.mutateAsync(truckData);
      return true;
    } catch (err) {
      return false;
    }
  };

  const updateTruck = async (id: string, updates: Partial<Truck>): Promise<boolean> => {
    try {
      await updateTruckMutation.mutateAsync({ id, updates });
      return true;
    } catch (err) {
      return false;
    }
  };

  const deleteTruck = async (id: string): Promise<boolean> => {
    try {
      await deleteTruckMutation.mutateAsync(id);
      return true;
    } catch (err) {
      return false;
    }
  };

  const updateTruckStatus = async (id: string, status: TruckStatus): Promise<boolean> => {
    try {
      await updateTruckStatusMutation.mutateAsync({ id, status });
      return true;
    } catch (err) {
      return false;
    }
  };

  // Update filters
  const updateFilters = useCallback((newFilters: TruckFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Update pagination
  const updatePagination = useCallback((newPage: number, newLimit?: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage,
      limit: newLimit || prev.limit
    }));
  }, []);

  // Real-time metrics using React Query
  const calculateMetrics = useCallback(() => {
    return {
      totalTrucks: trucks.length,
      activeTrucks: trucks.filter(t => t.status === 'scheduled' || t.status === 'GATE' || t.status === 'WEIGHING_BRIDGE' || t.status === 'WAREHOUSE').length,
      completedTrucks: trucks.filter(t => t.status === 'EXIT').length,
      trucksAtGate: trucks.filter(t => t.status === 'GATE').length
    };
  }, [trucks]);

  // Use local metrics calculation instead of API call
  const realTimeMetrics = calculateMetrics();

  return {
    trucks,
    loading,
    error,
    filters,
    pagination: paginationData,
    realTimeMetrics,
    fetchTrucks,
    createTruck,
    updateTruck,
    deleteTruck,
    updateTruckStatus,
    updateFilters,
    updatePagination,
    // Mutation states for UI feedback
    isCreating: createTruckMutation.isPending,
    isUpdating: updateTruckMutation.isPending,
    isDeleting: deleteTruckMutation.isPending,
    isUpdatingStatus: updateTruckStatusMutation.isPending
  };
}

// Keep existing hooks for backward compatibility using React Query
export function useTrucksOnSite() {
  const { data } = useQuery({
    queryKey: ['trucks-on-site-count'],
    queryFn: async () => {
      const data = await landsideAPI.getTrucksOnSiteCount();
      return data || { totalTrucks: getFallbackData('trucks').length };
    },
    staleTime: 10000, // Data is fresh for 10 seconds
    refetchInterval: 10000, // Refetch every 10 seconds
    retry: 3,
    retryDelay: 1000
  });

  return { data };
}

export function useArrivalCompliance() {
  const { data } = useQuery({
    queryKey: ['arrival-compliance'],
    queryFn: async () => {
      const data = await landsideAPI.getArrivalCompliance();
      return data || { 
        totalAppointments: getFallbackData('appointments').length,
        onTimeArrivals: 0,
        delayedArrivals: 0,
        complianceRate: 0
      };
    },
    staleTime: 30000, // Data is fresh for 30 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
    retryDelay: 1000
  });

  return { data };
}
