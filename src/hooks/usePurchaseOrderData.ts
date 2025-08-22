import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoicingAPI } from '@/services/apiService';
import { mockData } from '@/lib/mock-data';
import { CreatePurchaseOrderRequest, PurchaseOrder } from '@/types';
import { transformBackendPurchaseOrder } from '@/utils/dataTransformers';

// Query keys for purchase order data
export const purchaseOrderKeys = {
  all: ['purchaseOrders'] as const,
  lists: () => [...purchaseOrderKeys.all, 'list'] as const,
  list: (filters: string) => [...purchaseOrderKeys.lists(), { filters }] as const,
  details: () => [...purchaseOrderKeys.all, 'detail'] as const,
  detail: (id: string) => [...purchaseOrderKeys.details(), id] as const,
  overview: () => [...purchaseOrderKeys.all, 'overview'] as const,
};

// Hook to get all purchase orders
export function usePurchaseOrders() {
  return useQuery({
    queryKey: purchaseOrderKeys.lists(),
    queryFn: async () => {
      try {
        console.log('🔄 Fetching purchase orders from backend...');
        const data = await invoicingAPI.getPurchaseOrders();
        
        if (data && Array.isArray(data)) {
          console.log('✅ Backend returned array of purchase orders:', data.length);
          return data;
        } else {
          console.log('⚠️ Backend returned invalid data, using mock data');
          return mockData.purchaseOrders;
        }
      } catch (error) {
        console.log('❌ API error, using mock data:', error);
        return mockData.purchaseOrders;
      }
    },
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => {
      if (Array.isArray(data)) {
        return data;
      }
      console.warn('Data is not an array, falling back to mock data');
      return mockData.purchaseOrders;
    }
  });
}

// Hook to get purchase order overview (summary data)
export function usePurchaseOrderOverview() {
  return useQuery({
    queryKey: purchaseOrderKeys.overview(),
    queryFn: async () => {
      try {
        const data = await invoicingAPI.getPurchaseOrders();
        if (!data) {
          return mockData.purchaseOrders;
        }
        return data;
      } catch (error) {
        console.warn('Purchase order overview API call failed, using mock data:', error);
        return mockData.purchaseOrders;
      }
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
}

// Hook to get individual purchase order details
export function usePurchaseOrder(id: string) {
  return useQuery({
    queryKey: purchaseOrderKeys.detail(id),
    queryFn: async () => {
      try {
        // Since we don't have a getPurchaseOrder by ID endpoint yet, 
        // we'll fetch all and filter
        const data = await invoicingAPI.getPurchaseOrders();
        if (!data) {
          const mockPO = mockData.purchaseOrders.find(po => po.id === id);
          if (mockPO) {
            console.log(`Using mock data for purchase order ${id}`);
            return mockPO;
          }
          throw new Error(`Purchase order ${id} not found`);
        }
        
        const foundPO = data.find(po => po.id === id);
        if (!foundPO) {
          throw new Error(`Purchase order ${id} not found`);
        }
        
        return foundPO;
      } catch (error) {
        console.warn(`Purchase order detail API call failed for ${id}, using mock data:`, error);
        const mockPO = mockData.purchaseOrders.find(po => po.id === id);
        if (mockPO) {
          return mockPO;
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

// Hook to create a new purchase order
export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (purchaseOrderData: CreatePurchaseOrderRequest) => {
      const newPO = await invoicingAPI.createPurchaseOrder(purchaseOrderData);
      if (!newPO) {
        throw new Error('Failed to create purchase order');
      }
      return newPO;
    },
    onSuccess: (newPO) => {
      // Transform the new PO to frontend format and add it to the cache
      const transformedPO = transformBackendPurchaseOrder(newPO);
      queryClient.setQueryData(purchaseOrderKeys.lists(), (oldData: PurchaseOrder[] | undefined) => {
        if (oldData) {
          return [transformedPO, ...oldData];
        }
        return [transformedPO];
      });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.overview() });
    },
  });
}

// Hook to update a purchase order
export function useUpdatePurchaseOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PurchaseOrder> }) => {
      // TODO: Implement updatePurchaseOrder in apiService
      // const updatedPO = await invoicingAPI.updatePurchaseOrder(id, updates);
      // if (!updatedPO) {
      //   throw new Error(`Failed to update purchase order ${id}`);
      // }
      // return updatedPO;
      
      // For now, simulate update
      const existingPO = queryClient.getQueryData<PurchaseOrder[]>(purchaseOrderKeys.lists());
      if (!existingPO) {
        throw new Error('Purchase order not found');
      }
      
      const poIndex = existingPO.findIndex(po => po.id === id);
      if (poIndex === -1) {
        throw new Error('Purchase order not found');
      }
      
      const updatedPO = { ...existingPO[poIndex], ...updates };
      return updatedPO;
    },
    onSuccess: (updatedPO) => {
      queryClient.setQueryData(purchaseOrderKeys.detail(updatedPO.id), updatedPO);
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.overview() });
    },
  });
}

// Hook to delete a purchase order
export function useDeletePurchaseOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // TODO: Implement deletePurchaseOrder in apiService
      // const success = await invoicingAPI.deletePurchaseOrder(id);
      // if (!success) {
      //   throw new Error(`Failed to delete purchase order ${id}`);
      // }
      // return id;
      
      // For now, simulate deletion
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.removeQueries({ queryKey: purchaseOrderKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.overview() });
    },
  });
}

// Legacy hook for backward compatibility (deprecated)
export function usePurchaseOrderData() {
  const { data: purchaseOrders, isLoading: loading, error, refetch } = usePurchaseOrders();
  
  return {
    purchaseOrders: purchaseOrders || [],
    loading,
    error: error?.message || null,
    lastUpdated: new Date(),
    refetch,
  };
}
