import {mockData} from '@/lib/mock-data';
import {
    Appointment,
    BackendPurchaseOrder,
    CreatePurchaseOrderRequest,
    PurchaseOrder,
    Truck,
    TruckFilters,
    TruckStatus,
    Warehouse
} from '@/types';
import {transformBackendPurchaseOrders, transformBackendTruck, transformBackendTrucks} from '@/utils/dataTransformers';

// API base URLs
const API_BASE_URLS = {
    LANDSIDE: '/api/landside',
    WAREHOUSING: '/api/warehouses',
    INVOICING: '/api/invoicing',
    WATERSIDE: '/api/waterside'
};

// Generic API call function with error handling
const apiCall = async (url: string, options: RequestInit = {}) => {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            let errorMessage = `API call failed: ${response.status}`;
            try {
                const errorData = await response.text(); // Use text() instead of json() for 500 errors
                errorMessage += ` - ${errorData}`;
            } catch (e) {
                // If we can't read the error response
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        // Return null to indicate failure
        return null;
    }
};

// API functions for each context
export const landsideAPI = {
    // Get trucks on site count
    getTrucksOnSiteCount: () =>
        apiCall(`${API_BASE_URLS.LANDSIDE}/trucks/on-site/count`),

    // Get arrival compliance data
    getArrivalCompliance: () =>
        apiCall(`${API_BASE_URLS.LANDSIDE}/arrival-compliance`),

    // Get appointments
    getAppointments: () =>
        apiCall(`${API_BASE_URLS.LANDSIDE}/appointments`),

    // Create new appointment
    createAppointment: (appointmentData: any) => {
        return apiCall(`${API_BASE_URLS.LANDSIDE}/appointments`, {
            method: 'POST',
            body: JSON.stringify(appointmentData)
        });
    },

    // Update appointment
    updateAppointment: async (id: string, appointmentData: Partial<Appointment>) => {
        return apiCall(`${API_BASE_URLS.LANDSIDE}/appointments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(appointmentData)
        });
    },

    // Delete appointment
    deleteAppointment: async (id: string) => {
        return apiCall(`${API_BASE_URLS.LANDSIDE}/appointments/${id}`, {
            method: 'DELETE'
        });
    },

    // Get all trucks with filtering and pagination
    getTrucks: async (filters?: TruckFilters, page?: number, limit?: number) => {
        try {
            const url = `${API_BASE_URLS.LANDSIDE}/trucks?${buildQueryParams(filters, page, limit)}`;

            const response = await apiCall(url);

            console.log('Raw API response:', response); // Debug log
            console.log('Response type:', typeof response); // Debug log
            console.log('Is array?', Array.isArray(response)); // Debug log

            if (response && Array.isArray(response)) {
                // Transform backend response to frontend format
                const transformedTrucks = transformBackendTrucks(response);
                console.log('�� Transformed trucks:', transformedTrucks);

                return {
                    data: transformedTrucks,
                    pagination: {
                        total: transformedTrucks.length,
                        pages: Math.ceil(transformedTrucks.length / (limit || 20)),
                        page: page || 1,
                        limit: limit || 20
                    },
                    success: true
                };
            }

            console.log('API returned no data or invalid format');
            return null;
        } catch (error) {
            console.error('Failed to fetch trucks:', error);
            return null;
        }
    },

    // Get truck by ID
    getTruck: async (id: string) => {
        try {
            const response = await apiCall(`${API_BASE_URLS.LANDSIDE}/trucks/${id}`);

            if (response) {
                return {
                    data: transformBackendTruck(response),
                    success: true
                };
            }

            return null;
        } catch (error) {
            console.error('Failed to fetch truck:', error);
            return null;
        }
    },

    // Get truck movements/history
    getTruckMovements: (truckId: string) =>
        apiCall(`${API_BASE_URLS.LANDSIDE}/trucks/${truckId}/movements`),

    // Get truck statistics/metrics
    getTruckMetrics: () =>
        apiCall(`${API_BASE_URLS.LANDSIDE}/trucks/metrics`),

    // Create new truck
    createTruck: (truckData: Partial<Truck>) =>
        apiCall(`${API_BASE_URLS.LANDSIDE}/trucks`, {
            method: 'POST',
            body: JSON.stringify(truckData)
        }),

    // Update truck
    updateTruck: (id: string, updates: Partial<Truck>) =>
        apiCall(`${API_BASE_URLS.LANDSIDE}/trucks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        }),

    // Delete truck
    deleteTruck: (id: string) =>
        apiCall(`${API_BASE_URLS.LANDSIDE}/trucks/${id}`, {
            method: 'DELETE'
        }),

    // Update truck status
    updateTruckStatus: (id: string, status: TruckStatus) =>
        apiCall(`${API_BASE_URLS.LANDSIDE}/trucks/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({status})
        })
};

// Helper function to build query parameters
const buildQueryParams = (filters?: TruckFilters, page?: number, limit?: number): string => {
    const params = new URLSearchParams();

    if (filters?.status?.length) {
        params.append('status', filters.status.join(','));
    }
    if (filters?.material?.length) {
        params.append('material', filters.material.join(','));
    }
    if (filters?.seller?.length) {
        params.append('seller', filters.seller.join(','));
    }
    if (filters?.dateRange?.start) {
        params.append('dateFrom', filters.dateRange.start.toISOString());
    }
    if (filters?.dateRange?.end) {
        params.append('dateTo', filters.dateRange.end.toISOString());
    }
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    return params.toString();
};

export const warehousingAPI = {
    // Get warehouse overview
    getWarehouseOverview: () =>
        apiCall(`${API_BASE_URLS.WAREHOUSING}`),

    // Get individual warehouse
    getWarehouse: (id: string) =>
        apiCall(`${API_BASE_URLS.WAREHOUSING}/${id}`),

    // Create new warehouse
    createWarehouse: (warehouseData: Partial<Warehouse>) =>
        apiCall(`${API_BASE_URLS.WAREHOUSING}`, {
            method: 'POST',
            body: JSON.stringify(warehouseData)
        }),

    // Update warehouse
    updateWarehouse: (id: string, updates: Partial<Warehouse>) =>
        apiCall(`${API_BASE_URLS.WAREHOUSING}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        }),

    // Delete warehouse
    deleteWarehouse: (id: string) =>
        apiCall(`${API_BASE_URLS.WAREHOUSING}/${id}`, {
            method: 'DELETE'
        }),

    // Add material to warehouse
    addMaterialToWarehouse: (warehouseId: string, materialData: {
        material: string;
        weight: number;
        sellerId: string;
    }) =>
        apiCall(`${API_BASE_URLS.WAREHOUSING}/${warehouseId}/materials`, {
            method: 'POST',
            body: JSON.stringify(materialData)
        }),

    // Remove material from warehouse
    removeMaterialFromWarehouse: (warehouseId: string, materialId: string) =>
        apiCall(`${API_BASE_URLS.WAREHOUSING}/${warehouseId}/materials/${materialId}`, {
            method: 'DELETE'
        }),

    // Get warehouse statistics
    getWarehouseStats: () =>
        apiCall(`${API_BASE_URLS.WAREHOUSING}/stats`),

    // Get warehouse capacity alerts
    getCapacityAlerts: () =>
        apiCall(`${API_BASE_URLS.WAREHOUSING}/capacity-alerts`),
};

export const invoicingAPI = {
    // Get purchase orders with better error handling and data transformation
    getPurchaseOrders: async (): Promise<PurchaseOrder[] | null> => {
        try {
            const response = await apiCall(`${API_BASE_URLS.INVOICING}/purchase-orders`);

            if (response && Array.isArray(response)) {
                // Transform backend response to frontend format
                return transformBackendPurchaseOrders(response as BackendPurchaseOrder[]);
            }

            return null;
        } catch (error) {
            console.error('Failed to fetch purchase orders:', error);
            return null;
        }
    },

    // Create new purchase order
    createPurchaseOrder: async (purchaseOrderData: CreatePurchaseOrderRequest): Promise<BackendPurchaseOrder | null> => {
        try {
            const response = await apiCall(`${API_BASE_URLS.INVOICING}/purchase-orders`, {
                method: 'POST',
                body: JSON.stringify(purchaseOrderData)
            });

            if (response) {
                console.log('Purchase order created successfully:', response);
                return response;
            }

            return null;
        } catch (error) {
            console.error('Failed to create purchase order:', error);
            return null;
        }
    },

    // Get shipping orders
    getShippingOrders: () =>
        apiCall(`${API_BASE_URLS.WATERSIDE}/shipping-orders`)
};

// transformation function for shipping orders
const transformBackendShippingOrder = (backendOrder: any) => {
    return {
        id: backendOrder.id,
        soNumber: backendOrder.soNumber,
        vesselNumber: backendOrder.vesselNumber,
        poReference: backendOrder.poReference,
        customerNumber: backendOrder.customerNumber,
        estimatedArrivalDate: new Date(backendOrder.estimatedArrivalDate),
        estimatedDepartureDate: new Date(backendOrder.estimatedDepartureDate),
        actualArrivalDate: backendOrder.actualArrivalDate ? new Date(backendOrder.actualArrivalDate) : null,
        actualDepartureDate: backendOrder.actualDepartureDate ? new Date(backendOrder.actualDepartureDate) : null,
        status: backendOrder.status,
        inspectionCompleted: backendOrder.inspectionCompleted,
        bunkeringCompleted: backendOrder.bunkeringCompleted,
        loadingCompleted: backendOrder.loadingCompleted,
        foremanSignature: backendOrder.foremanSignature,
        validationDate: backendOrder.validationDate ? new Date(backendOrder.validationDate) : null
    };
};

const transformBackendShippingOrders = (backendOrders: any[]) => {
    return backendOrders.map(transformBackendShippingOrder);
};

// the watersideAPI getShippingOrders to use transformation
export const watersideAPI = {
    // Get all shipping orders with transformation
    getShippingOrders: async () => {
        try {
            const response = await apiCall(`${API_BASE_URLS.WATERSIDE}/shipping-orders`);

            if (response && Array.isArray(response)) {
                console.log('Raw shipping orders from backend:', response.length);
                const transformedOrders = transformBackendShippingOrders(response);
                console.log('Transformed shipping orders:', transformedOrders.length);
                return transformedOrders;
            }

            console.log('Backend returned invalid data for shipping orders');
            return null;
        } catch (error) {
            console.error('Failed to fetch shipping orders:', error);
            return null;
        }
    },

    // Get shipping order by ID
    getShippingOrder: (id: string) =>
        apiCall(`${API_BASE_URLS.WATERSIDE}/shipping-orders/${id}`),

    // Get unmatched shipping orders (for foreman)
    getUnmatchedShippingOrders: () =>
        apiCall(`${API_BASE_URLS.WATERSIDE}/foreman/unmatched-shipping-orders`),

    // Get shipment arrivals (for foreman)
    getShipmentArrivals: () =>
        apiCall(`${API_BASE_URLS.WATERSIDE}/foreman/shipment-arrivals`),

    // Match shipping order with purchase order
    matchShippingOrder: (shippingOrderId: string, foremanSignature: string) =>
        apiCall(`${API_BASE_URLS.WATERSIDE}/foreman/match-shipping-order`, {
            method: 'POST',
            body: JSON.stringify({shippingOrderId, foremanSignature})
        }),

    // Get outstanding inspections
    getOutstandingInspections: () =>
        apiCall(`${API_BASE_URLS.WATERSIDE}/inspections/outstanding`),

    // Complete inspection
    completeInspection: (shippingOrderId: string, inspectorSignature: string) =>
        apiCall(`${API_BASE_URLS.WATERSIDE}/inspections/complete`, {
            method: 'POST',
            body: JSON.stringify({shippingOrderId, inspectorSignature})
        }),

    // Get outstanding bunkering operations
    getOutstandingBunkering: () =>
        apiCall(`${API_BASE_URLS.WATERSIDE}/bunkering/outstanding`),

    // Complete bunkering
    completeBunkering: (shippingOrderId: string, bunkeringOfficerSignature: string) =>
        apiCall(`${API_BASE_URLS.WATERSIDE}/bunkering/complete`, {
            method: 'POST',
            body: JSON.stringify({shippingOrderId, bunkeringOfficerSignature})
        }),

    // Get operations overview for specific vessel
    getVesselOperations: (vesselNumber: string) =>
        apiCall(`${API_BASE_URLS.WATERSIDE}/captain/operations/${vesselNumber}`),

    // Get operations overview for all vessels
    getOperationsOverview: () =>
        apiCall(`${API_BASE_URLS.WATERSIDE}/captain/operations-overview`),

    // Submit new shipping order
    submitShippingOrder: (shippingOrderData: any) =>
        apiCall(`${API_BASE_URLS.WATERSIDE}/shipping-orders`, {
            method: 'POST',
            body: JSON.stringify(shippingOrderData)
        })
};

// Fallback to mock data if API fails
export const getFallbackData = (dataType: string) => {
    switch (dataType) {
        case 'warehouses':
            return mockData.warehouses;
        case 'trucks':
            return mockData.trucks;
        case 'appointments':
            return mockData.appointments;
        case 'purchaseOrders':
            return mockData.purchaseOrders;
        case 'shippingOrders':
            return mockData.shippingOrders;
        default:
            return [];
    }
};
