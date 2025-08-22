import { BackendPurchaseOrder, PurchaseOrder, MaterialType, BackendTruck, Truck, TruckStatus } from '@/types';

// Map backend status to frontend status
const mapBackendStatus = (backendStatus: string): 'outstanding' | 'fulfilled' | 'cancelled' => {
  switch (backendStatus) {
    case 'PENDING':
      return 'outstanding';
    case 'FULFILLED':
      return 'fulfilled';
    case 'CANCELLED':
      return 'cancelled';
    default:
      return 'outstanding';
  }
};

// Map raw material name to MaterialType
const mapRawMaterialToType = (rawMaterialName: string): MaterialType => {
  const materialMap: Record<string, MaterialType> = {
    'Gypsum': 'gypsum',
    'Iron_Ore': 'iron-ore',
    'Cement': 'cement',
    'PetCoke': 'petcoke',
    'Slag': 'slag'
  };
  
  return materialMap[rawMaterialName] || 'unknown'; // Default fallback
};

// Map backend material string to MaterialType
const mapBackendMaterialToType = (material: string): MaterialType => {
  const materialMap: Record<string, MaterialType> = {
    'Gypsum': 'gypsum',
    'Iron_Ore': 'iron-ore',
    'Cement': 'cement',
    'PetCoke': 'petcoke',
    'Slag': 'slag'
  };
  
  return materialMap[material] || 'unknown'; // Default fallback
};


// Transform backend response to frontend format
export const transformBackendPurchaseOrder = (backendPO: BackendPurchaseOrder): PurchaseOrder => {
  return {
    id: backendPO.purchaseOrderId,
    poNumber: backendPO.purchaseOrderNumber,
    customerId: backendPO.customerNumber,
    customerName: backendPO.customerName,
    sellerId: backendPO.sellerId,
    sellerName: backendPO.sellerName,
    orderDate: new Date(backendPO.orderDate),
    status: mapBackendStatus(backendPO.status),
    items: backendPO.orderLines.map((line, index) => ({
      material: mapRawMaterialToType(line.rawMaterialName),
      quantity: line.amountInTons,
      agreedPricePerTon: line.pricePerTon,
      totalPrice: line.amountInTons * line.pricePerTon
    })),
    totalValue: backendPO.totalValue,
    estimatedDeliveryDate: undefined 
  };
};

export const transformBackendPurchaseOrders = (backendPOs: BackendPurchaseOrder[]): PurchaseOrder[] => {
  return backendPOs.map(transformBackendPurchaseOrder);
};

// Transform backend truck response to frontend format
export const transformBackendTruck = (backendTruck: BackendTruck): Truck => {
  return {
    id: backendTruck.id,
    licensePlate: backendTruck.licensePlate,
    material: mapBackendMaterialToType(backendTruck.material),
    plannedArrival: new Date(backendTruck.plannedArrival),
    actualArrival: backendTruck.actualArrival ? new Date(backendTruck.actualArrival) : undefined,
    status: backendTruck.status as TruckStatus,
    sellerId: backendTruck.sellerId,
    sellerName: backendTruck.sellerName,
    warehouseNumber: backendTruck.warehouseNumber,
    grossWeight: backendTruck.grossWeight || undefined,
    tareWeight: backendTruck.tareWeight || undefined,
    netWeight: backendTruck.netWeight || undefined
  };
};

export const transformBackendTrucks = (backendTrucks: BackendTruck[]): Truck[] => {
  return backendTrucks.map(transformBackendTruck);
};
