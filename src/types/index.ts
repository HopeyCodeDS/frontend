// Domain Types for KdG MineralFlow System

export type MaterialType = 'gypsum' | 'iron-ore' | 'cement' | 'petcoke' | 'slag';

export type OperationStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

export type TruckType = 'LARGE' | 'SMALL' | 'MEDIUM';

export type TruckStatus = 'scheduled' | 'GATE' | 'WEIGHING_BRIDGE' | 'WAREHOUSE' | 'EXIT' | 'At the Truck Garage';    

export interface Material {
    type: MaterialType;
    name: string;
    pricePerTon: number;
    storageCostPerTonPerDay: number;
    color: string;
    description: string;
}

// Update the Truck interface to match backend structure
export interface Truck {
  id: string;
  licensePlate: string;
  material: MaterialType;
  plannedArrival: Date;
  actualArrival?: Date;
  status: TruckStatus;
  sellerId: string;
  sellerName: string;
  warehouseNumber: string | null;
  grossWeight?: number;
  tareWeight?: number;
  netWeight?: number;
}

// Backend data structure
export interface BackendPayloadRecord {
    pdtId: string;
    deliveryTime: string;
    payloadWeight: number;
    rawMaterialName: string;
    sellerId: string;
}

// Warehouse interface in line with the backend structure
export interface Warehouse {
    id: string;
    number: string;
    sellerId: string;
    sellerName: string;
    material?: MaterialType;
    currentStock: number;
    maxCapacity: number;
    location: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    payloads: BackendPayloadRecord[];
}

export interface PayloadRecord {
    id: string;
    deliveryTime: Date;
    weight: number;
    material: MaterialType;
    sellerId: string;
}

export interface BackendPurchaseOrder {
    purchaseOrderId: string;
    purchaseOrderNumber: string;
    customerNumber: string;
    customerName: string;
    sellerId: string;
    sellerName: string;
    orderDate: string;
    status: 'PENDING' | 'FULFILLED' | 'CANCELLED';
    totalValue: number;
    orderLines: BackendOrderLine[];
}

export interface BackendOrderLine {
    rawMaterialName: string;
    amountInTons: number;
    pricePerTon: number;
    lineTotal: number;
}

// Interface for creating purchase orders
export interface CreatePurchaseOrderRequest {
    purchaseOrderNumber: string;
    customerNumber: string;
    customerName: string;
    sellerId: string;
    sellerName: string;
    orderDate: string;
    orderLines: CreateOrderLineRequest[];
}

export interface CreateOrderLineRequest {
    lineNumber: number;
    rawMaterialName: string;
    amountInTons: number;
    pricePerTon: number;
}


export interface PurchaseOrder {
    id: string;
    poNumber: string;
    customerId: string;
    customerName: string;
    sellerId: string;
    sellerName: string;
    orderDate: Date;
    status: 'outstanding' | 'fulfilled' | 'cancelled';
    items: PurchaseOrderItem[];
    totalValue: number;
    estimatedDeliveryDate?: Date;
}

export interface PurchaseOrderItem {
    material: MaterialType;
    quantity: number;
    agreedPricePerTon: number;
    totalPrice: number;
}

export enum ShippingOrderStatus {
    ARRIVED = 'arrived',
    VALIDATED = 'validated',
    BUNKERING = 'bunkering',
    READY_FOR_LOADING = 'ready_for_loading',
    DEPARTED = 'departed',
    INSPECTING = 'inspecting'
}

export interface ShippingOrder {
    foremanSignature: any;
    id: string;
    soNumber: string;
    vesselNumber: string;
    poReference: string;
    customerNumber: string;
    estimatedArrivalDate: Date;
    estimatedDepartureDate: Date;
    actualArrivalDate: Date | null;
    actualDepartureDate: Date | null;
    status: ShippingOrderStatus;
    inspectionCompleted: boolean;
    bunkeringCompleted: boolean;
    loadingCompleted: boolean;
}

export interface InspectionOperation {
    id: string;
    shippingOrderId: string;
    inspectorName: string;
    scheduledDate: Date;
    completedDate?: Date;
    status: OperationStatus;
    signature?: string;
    notes?: string;
}

export interface BunkeringOperation {
    id: string;
    shippingOrderId: string;
    scheduledDate: Date;
    completedDate?: Date;
    status: OperationStatus;
    fuelAmount?: number;
    notes?: string;
}

export interface Appointment {
    id: string;
    truckId: string;
    licensePlate: string;
    sellerId: string;
    sellerName: string;
    material: MaterialType;
    scheduledTime: Date;
    arrivalWindow: {
        start: Date;
        end: Date;
    };
    status: 'scheduled' | 'arrived' | 'cancelled' | 'departed';
    warehouseNumber: string;
}

export interface Invoice {
    id: string;
    customerId: string;
    customerName: string;
    invoiceDate: Date;
    dueDate: Date;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    storageCharges: InvoiceLineItem[];
    commissionCharges: InvoiceLineItem[];
    totalAmount: number;
}

export interface InvoiceLineItem {
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    period?: {
        from: Date;
        to: Date;
    };
}

// Dashboard specific types
export interface DashboardMetrics {
    trucksOnSite: number;
    scheduledArrivals: number;
    delayedTrucks: number;
    warehousesAtCapacity: number;
    totalWarehouseCapacity: number;
    usedWarehouseCapacity: number;
    outstandingPOs: number;
    fulfilledPOs: number;
    shipsInPort: number;
    pendingInspections: number;
    pendingBunkering: number;
}

export interface TimeSeriesData {
    timestamp: Date;
    value: number;
    label?: string;
}

// Filter and search types
export interface TruckFilters {
    status?: TruckStatus[];
    material?: MaterialType[];
    seller?: string[];
    dateRange?: {
        start: Date;
        end: Date;
    };
}

export interface WarehouseFilters {
    seller?: string[];
    material?: MaterialType[];
    capacityRange?: {
        min: number;
        max: number;
    };
}

// API Response types
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    timestamp: Date;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    success: boolean;
    message?: string;
}

// Backend truck data structure (what comes from API)
export interface BackendTruck {
  id: string;
  licensePlate: string;
  material: string; // Backend sends "Gypsum", "Iron_Ore", etc.
  plannedArrival: string; // ISO date string
  actualArrival: string | null; // ISO date string or null
  status: string; // Backend sends "SCHEDULED", "ARRIVED", etc.
  sellerId: string;
  sellerName: string;
  warehouseNumber: string | null;
  grossWeight: number | null;
  tareWeight: number | null;
  netWeight: number | null;
}

// Update the Truck interface to match backend structure
export interface Truck {
  id: string;
  licensePlate: string;
  material: MaterialType;
  plannedArrival: Date;
  actualArrival?: Date;
  status: TruckStatus;
  sellerId: string;
  sellerName: string;
  warehouseNumber: string | null;
  grossWeight?: number;
  tareWeight?: number;
  netWeight?: number;
  // Remove fields that don't exist in backend
  // actualDeparture: any;
  // truckType: TruckType;
}