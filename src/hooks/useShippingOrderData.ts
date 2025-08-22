import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { watersideAPI } from '@/services/apiService';
import { mockData } from '@/lib/mock-data';
import { ShippingOrder, ShippingOrderStatus } from '@/types';

// Query keys for shipping order data
export const shippingOrderKeys = {
  all: ['shippingOrders'] as const,
  lists: () => [...shippingOrderKeys.all, 'list'] as const,
  list: (filters: string) => [...shippingOrderKeys.lists(), { filters }] as const,
  details: () => [...shippingOrderKeys.all, 'detail'] as const,
  detail: (id: string) => [...shippingOrderKeys.details(), id] as const,
  unmatched: () => [...shippingOrderKeys.all, 'unmatched'] as const,
  arrivals: () => [...shippingOrderKeys.all, 'arrivals'] as const,
  outstandingInspections: () => [...shippingOrderKeys.all, 'inspections', 'outstanding'] as const,
  outstandingBunkering: () => [...shippingOrderKeys.all, 'bunkering', 'outstanding'] as const,
  vesselOperations: (vesselNumber: string) => [...shippingOrderKeys.all, 'vessel', vesselNumber] as const,
  operationsOverview: () => [...shippingOrderKeys.all, 'operations', 'overview'] as const,
};

// Hook to get all shipping orders
export function useShippingOrders() {
  return useQuery({
    queryKey: shippingOrderKeys.lists(),
    queryFn: async () => {
      try {
        console.log('🔄 Fetching shipping orders from backend...');
        const data = await watersideAPI.getShippingOrders();
        
        if (data && Array.isArray(data)) {
          console.log('✅ Backend returned array of shipping orders:', data.length);
          return data;
        } else {
          console.log('⚠️ Backend returned invalid data, using mock data');
          return mockData.shippingOrders;
        }
      } catch (error) {
        console.log('❌ API error, using mock data:', error);
        return mockData.shippingOrders;
      }
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    select: (data) => {
      if (Array.isArray(data)) {
        return data;
      }
      console.warn('Data is not an array, falling back to mock data');
      return mockData.shippingOrders;
    }
  });
}

// Hook to get individual shipping order details
export function useShippingOrder(id: string) {
  return useQuery({
    queryKey: shippingOrderKeys.detail(id),
    queryFn: async () => {
      try {
        const data = await watersideAPI.getShippingOrder(id);
        if (!data) {
          const mockOrder = mockData.shippingOrders.find(so => so.id === id);
          if (mockOrder) {
            console.log(`Using mock data for shipping order ${id}`);
            return mockOrder;
          }
          throw new Error(`Shipping order ${id} not found`);
        }
        return data;
      } catch (error) {
        console.warn(`Shipping order detail API call failed for ${id}, using mock data:`, error);
        const mockOrder = mockData.shippingOrders.find(so => so.id === id);
        if (mockOrder) {
          return mockOrder;
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

// Hook to get unmatched shipping orders (for foreman)
export function useUnmatchedShippingOrders() {
  return useQuery({
    queryKey: shippingOrderKeys.unmatched(),
    queryFn: async () => {
      try {
        const data = await watersideAPI.getUnmatchedShippingOrders();
        if (!data) {
          console.log('No unmatched shipping orders from backend, using filtered mock data');
          return mockData.shippingOrders.filter(so => 
            so.status === ShippingOrderStatus.ARRIVED && !so.foremanSignature
          );
        }
        return data;
      } catch (error) {
        console.warn('Unmatched shipping orders API call failed, using filtered mock data:', error);
        return mockData.shippingOrders.filter(so => 
          so.status === ShippingOrderStatus.ARRIVED && !so.foremanSignature
        );
      }
    },
    staleTime: 15000,
    gcTime: 2 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
}

// Hook to get shipment arrivals (for foreman)
export function useShipmentArrivals() {
  return useQuery({
    queryKey: shippingOrderKeys.arrivals(),
    queryFn: async () => {
      try {
        const data = await watersideAPI.getShipmentArrivals();
        if (!data) {
          console.log('No shipment arrivals from backend, using filtered mock data');
          return mockData.shippingOrders.filter(so => 
            so.status === ShippingOrderStatus.ARRIVED
          );
        }
        return data;
      } catch (error) {
        console.warn('Shipment arrivals API call failed, using filtered mock data:', error);
        return mockData.shippingOrders.filter(so => 
          so.status === ShippingOrderStatus.ARRIVED
        );
      }
    },
    staleTime: 15000,
    gcTime: 2 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
}

// Hook to get outstanding inspections
export function useOutstandingInspections() {
  return useQuery({
    queryKey: shippingOrderKeys.outstandingInspections(),
    queryFn: async () => {
      try {
        const data = await watersideAPI.getOutstandingInspections();
        if (!data) {
          console.log('No outstanding inspections from backend, using filtered mock data');
          return mockData.shippingOrders.filter(so => 
            so.status === ShippingOrderStatus.VALIDATED && !so.inspectionCompleted
          );
        }
        return data;
      } catch (error) {
        console.warn('Outstanding inspections API call failed, using filtered mock data:', error);
        return mockData.shippingOrders.filter(so => 
          so.status === ShippingOrderStatus.VALIDATED && !so.inspectionCompleted
        );
      }
    },
    staleTime: 15000,
    gcTime: 2 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
}

// Hook to get outstanding bunkering operations
export function useOutstandingBunkering() {
  return useQuery({
    queryKey: shippingOrderKeys.outstandingBunkering(),
    queryFn: async () => {
      try {
        const data = await watersideAPI.getOutstandingBunkering();
        if (!data) {
          console.log('No outstanding bunkering from backend, using filtered mock data');
          return mockData.shippingOrders.filter(so => 
            so.status === ShippingOrderStatus.BUNKERING && !so.bunkeringCompleted
          );
        }
        return data;
      } catch (error) {
        console.warn('Outstanding bunkering API call failed, using filtered mock data:', error);
        return mockData.shippingOrders.filter(so => 
          so.status === ShippingOrderStatus.BUNKERING && !so.bunkeringCompleted
        );
      }
    },
    staleTime: 15000,
    gcTime: 2 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
}

// Hook to get vessel operations
export function useVesselOperations(vesselNumber: string) {
  return useQuery({
    queryKey: shippingOrderKeys.vesselOperations(vesselNumber),
    queryFn: async () => {
      try {
        const data = await watersideAPI.getVesselOperations(vesselNumber);
        if (!data) {
          console.log(`No vessel operations from backend for ${vesselNumber}, using filtered mock data`);
          return mockData.shippingOrders.filter(so => 
            so.vesselNumber === vesselNumber
          );
        }
        return data;
      } catch (error) {
        console.warn(`Vessel operations API call failed for ${vesselNumber}, using filtered mock data:`, error);
        return mockData.shippingOrders.filter(so => 
          so.vesselNumber === vesselNumber
        );
      }
    },
    enabled: !!vesselNumber,
    staleTime: 15000,
    gcTime: 2 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
}

// Hook to get operations overview
export function useOperationsOverview() {
  return useQuery({
    queryKey: shippingOrderKeys.operationsOverview(),
    queryFn: async () => {
      try {
        const data = await watersideAPI.getOperationsOverview();
        if (!data) {
          console.log('No operations overview from backend, using mock data');
          return mockData.shippingOrders;
        }
        return data;
      } catch (error) {
        console.warn('Operations overview API call failed, using mock data:', error);
        return mockData.shippingOrders;
      }
    },
    staleTime: 15000,
    gcTime: 2 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
}

// Hook to match shipping order with purchase order
export function useMatchShippingOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ shippingOrderId, foremanSignature }: { 
      shippingOrderId: string; 
      foremanSignature: string; 
    }) => {
      const result = await watersideAPI.matchShippingOrder(shippingOrderId, foremanSignature);
      if (!result) {
        throw new Error('Failed to match shipping order');
      }
      return result;
    },
    onSuccess: (_, { shippingOrderId }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: shippingOrderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: shippingOrderKeys.unmatched() });
      queryClient.invalidateQueries({ queryKey: shippingOrderKeys.arrivals() });
      queryClient.invalidateQueries({ queryKey: shippingOrderKeys.detail(shippingOrderId) });
    },
  });
}

// Hook to complete inspection
export function useCompleteInspection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ shippingOrderId, inspectorSignature }: { 
      shippingOrderId: string; 
      inspectorSignature: string; 
    }) => {
      const result = await watersideAPI.completeInspection(shippingOrderId, inspectorSignature);
      if (!result) {
        throw new Error('Failed to complete inspection');
      }
      return result;
    },
    onSuccess: (_, { shippingOrderId }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: shippingOrderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: shippingOrderKeys.outstandingInspections() });
      queryClient.invalidateQueries({ queryKey: shippingOrderKeys.detail(shippingOrderId) });
    },
  });
}

// Hook to complete bunkering
export function useCompleteBunkering() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ shippingOrderId, bunkeringOfficerSignature }: { 
      shippingOrderId: string; 
      bunkeringOfficerSignature: string; 
    }) => {
      const result = await watersideAPI.completeBunkering(shippingOrderId, bunkeringOfficerSignature);
      if (!result) {
        throw new Error('Failed to complete bunkering');
      }
      return result;
    },
    onSuccess: (_, { shippingOrderId }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: shippingOrderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: shippingOrderKeys.outstandingBunkering() });
      queryClient.invalidateQueries({ queryKey: shippingOrderKeys.detail(shippingOrderId) });
    },
  });
}

// Hook to submit new shipping order
export function useSubmitShippingOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (shippingOrderData: any) => {
      const result = await watersideAPI.submitShippingOrder(shippingOrderData);
      if (!result) {
        throw new Error('Failed to submit shipping order');
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: shippingOrderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: shippingOrderKeys.operationsOverview() });
    },
  });
}
