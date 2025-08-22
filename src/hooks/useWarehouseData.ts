import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { warehousingAPI } from '@/services/apiService';
import { mockData } from '@/lib/mock-data';
import { Warehouse } from '@/types';

// Query keys for warehouse data
export const warehouseKeys = {
  all: ['warehouses'] as const,
  lists: () => [...warehouseKeys.all, 'list'] as const,
  list: (filters: string) => [...warehouseKeys.lists(), { filters }] as const,
  details: () => [...warehouseKeys.all, 'detail'] as const,
  detail: (id: string) => [...warehouseKeys.details(), id] as const,
  overview: () => [...warehouseKeys.all, 'overview'] as const,
  inventory: (id: string) => [...warehouseKeys.all, 'inventory', id] as const, // ADDED THIS LINE
};

// Hook to get all warehouses
export function useWarehouses() {
  return useQuery({
    queryKey: warehouseKeys.lists(),
    queryFn: async () => {
      try {
        console.log('🔄 Fetching warehouses from backend...');
        const data = await warehousingAPI.getWarehouseOverview();
        
        if (data && Array.isArray(data)) {
          console.log('✅ Backend returned array of warehouses:', data.length);
          return data;
        } else {
          console.log('⚠️ Backend returned invalid data, using mock data');
          return mockData.warehouses;
        }
      } catch (error) {
        console.log('❌ API error, using mock data:', error);
        return mockData.warehouses;
      }
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    select: (data) => {
      if (Array.isArray(data)) {
        return data;
      }
      console.warn('Data is not an array, falling back to mock data');
      return mockData.warehouses;
    }
  });
}

// Hook to get warehouse overview (summary data)
export function useWarehouseOverview() {
  return useQuery({
    queryKey: warehouseKeys.overview(),
    queryFn: async () => {
      try {
        const data = await warehousingAPI.getWarehouseOverview();
        if (!data) {
          return mockData.warehouses;
        }
        return data;
      } catch (error) {
        console.warn('Warehouse overview API call failed, using mock data:', error);
        return mockData.warehouses;
      }
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
}

// Hook to get individual warehouse details
export function useWarehouse(id: string) {
  return useQuery({
    queryKey: warehouseKeys.detail(id),
    queryFn: async () => {
      try {
        const data = await warehousingAPI.getWarehouse(id);
        if (!data) {
          const mockWarehouse = mockData.warehouses.find(w => w.id === id);
          if (mockWarehouse) {
            console.log(`Using mock data for warehouse ${id}`);
            return mockWarehouse;
          }
          throw new Error(`Warehouse ${id} not found`);
        }
        return data;
      } catch (error) {
        console.warn(`Warehouse detail API call failed for ${id}, using mock data:`, error);
        const mockWarehouse = mockData.warehouses.find(w => w.id === id);
        if (mockWarehouse) {
          return mockWarehouse;
        }
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
}

// Hook to get warehouse inventory - FIXED
export function useWarehouseInventory(id: string) {
  return useQuery({
    queryKey: warehouseKeys.inventory(id), // This should now work
    queryFn: async () => {
      try {
        const data = await warehousingAPI.getWarehouse(id);
        if (!data) {
          const mockWarehouse = mockData.warehouses.find(w => w.id === id);
          if (mockWarehouse) {
            console.log(`Using mock data for warehouse ${id} inventory`);
            return mockWarehouse;
          }
          throw new Error(`Inventory for warehouse ${id} not found`);
        }
        return data;
      } catch (error) {
        console.warn(`Warehouse inventory API call failed for ${id}, using mock data:`, error);
        const mockWarehouse = mockData.warehouses.find(w => w.id === id);
        if (mockWarehouse) {
          return mockWarehouse;
        }
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 15000,
    gcTime: 2 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
}

// Hook to create a new warehouse
export function useCreateWarehouse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (warehouseData: Partial<Warehouse>) => {
      const newWarehouse = await warehousingAPI.createWarehouse(warehouseData);
      if (!newWarehouse) {
        throw new Error('Failed to create warehouse');
      }
      return newWarehouse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
    },
  });
}

// Hook to update a warehouse
export function useUpdateWarehouse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Warehouse> }) => {
      const updatedWarehouse = await warehousingAPI.updateWarehouse(id, updates);
      if (!updatedWarehouse) {
        throw new Error(`Failed to update warehouse ${id}`);
      }
      return updatedWarehouse;
    },
    onSuccess: (updatedWarehouse) => {
      queryClient.setQueryData(warehouseKeys.detail(updatedWarehouse.id), updatedWarehouse);
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.overview() });
    },
  });
}

// Hook to delete a warehouse
export function useDeleteWarehouse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const success = await warehousingAPI.deleteWarehouse(id);
      if (!success) {
        throw new Error(`Failed to delete warehouse ${id}`);
      }
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.removeQueries({ queryKey: warehouseKeys.detail(deletedId) });
      queryClient.removeQueries({ queryKey: warehouseKeys.inventory(deletedId) });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.overview() });
    },
  });
}

// Hook to add material to warehouse
export function useAddMaterialToWarehouse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ warehouseId, materialData }: {
      warehouseId: string;
      materialData: { material: string; weight: number; sellerId: string };
    }) => {
      const result = await warehousingAPI.addMaterialToWarehouse(warehouseId, materialData);
      if (!result) {
        throw new Error('Failed to add material to warehouse');
      }
      return result;
    },
    onSuccess: (_, { warehouseId }) => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.detail(warehouseId) });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.inventory(warehouseId) });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.overview() });
    },
  });
}

// Hook to remove material from warehouse
export function useRemoveMaterialFromWarehouse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ warehouseId, materialId }: { warehouseId: string; materialId: string }) => {
      const success = await warehousingAPI.removeMaterialFromWarehouse(warehouseId, materialId);
      if (!success) {
        throw new Error('Failed to remove material from warehouse');
      }
      return materialId;
    },
    onSuccess: (_, { warehouseId }) => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.detail(warehouseId) });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.inventory(warehouseId) });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.overview() });
    },
  });
}
