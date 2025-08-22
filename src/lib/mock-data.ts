import {Appointment, DashboardMetrics, MaterialType, PurchaseOrder, ShippingOrder, Truck, TruckType, Warehouse} from '@/types';
import {MATERIALS, OPERATIONAL_LIMITS} from './constants';

// Helper function to generate random dates
const randomDate = (start: Date, end: Date): Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate random warehouse locations
const generateWarehouseLocation = (index: number) => {
    const row = Math.floor(index / 5);
    const col = index % 5;
    return {
        x: 50 + col * 220,
        y: 50 + row * 160,
        width: 180,
        height: 120
    };
};

// Mock sellers data
const MOCK_SELLERS = [
    {id: 'seller-1', name: 'Nordic Minerals Ltd'},
    {id: 'seller-2', name: 'Baltic Materials Co'},
    {id: 'seller-3', name: 'European Resources'},
    {id: 'seller-4', name: 'Atlantic Mining Group'},
    {id: 'seller-5', name: 'Continental Supplies'}
];

// Mock buyers data
const MOCK_BUYERS = [
    {id: 'buyer-1', name: 'Global Steel Corp'},
    {id: 'buyer-2', name: 'Construction Giants Ltd'},
    {id: 'buyer-3', name: 'Industrial Solutions'},
    {id: 'buyer-4', name: 'Maritime Builders'}
];

// Generate mock trucks data
export const generateMockTrucks = (count: number = 25): Truck[] => {
    const trucks: Truck[] = [];
    const today = new Date();
    const materials = Object.keys(MATERIALS) as MaterialType[];

    for (let i = 0; i < count; i++) {
        const seller = MOCK_SELLERS[Math.floor(Math.random() * MOCK_SELLERS.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const plannedArrival = randomDate(
            new Date(today.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
            new Date(today.getTime() + 8 * 60 * 60 * 1000)  // 8 hours from now
        );

        const statuses: Truck['status'][] = ['scheduled', 'GATE', 'WEIGHING_BRIDGE', 'WAREHOUSE', 'EXIT', 'At the Truck Garage'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        // Determine if truck has arrived based on status
        const hasArrived = ['GATE', 'WEIGHING_BRIDGE', 'WAREHOUSE', 'EXIT'].includes(status);
        const actualArrival = hasArrived ?
            randomDate(plannedArrival, new Date()) : undefined;

        // Generate weights if truck has been weighed
        const grossWeight = hasArrived ? 25000 + Math.random() * 15000 : undefined;
        const tareWeight = hasArrived ? 5000 + Math.random() * 3000 : undefined;
        const netWeight = grossWeight && tareWeight ? grossWeight - tareWeight : undefined;

        trucks.push({
            id: `truck-${i + 1}`,
            licensePlate: `KDG${String(i + 1).padStart(3, '0')}`,
            material,
            plannedArrival,
            actualArrival,
            status,
            sellerId: seller.id,
            sellerName: seller.name,
            warehouseNumber: `W${String((i % 25) + 1).padStart(2, '0')}`,
            grossWeight,
            tareWeight,
            netWeight
        });
    }

    return trucks;
};

// Generate mock warehouses data
export const generateMockWarehouses = (): Warehouse[] => {
    const warehouses: Warehouse[] = [];

    // Create 5 warehouses per seller (25 total)
    MOCK_SELLERS.forEach((seller, sellerIndex) => {
        const materials = Object.keys(MATERIALS) as MaterialType[];

        materials.forEach((material, materialIndex) => {
            const warehouseIndex = sellerIndex * 5 + materialIndex;
            const currentStock = Math.random() * OPERATIONAL_LIMITS.MAX_WAREHOUSE_CAPACITY;

            // Generate payload records for this warehouse
            const payloadCount = Math.floor(Math.random() * 8) + 2;
            const payloads = Array.from({length: payloadCount}, (_, i) => ({
                id: `payload-${warehouseIndex}-${i}`,
                deliveryTime: randomDate(
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
                    new Date()
                ),
                weight: Math.random() * 5000 + 1000,
                material,
                sellerId: seller.id
            }));

            warehouses.push({
                id: `warehouse-${warehouseIndex + 1}`,
                number: `W${String(warehouseIndex + 1).padStart(2, '0')}`,
                sellerId: seller.id,
                sellerName: seller.name,
                material: currentStock > 1000 ? material : undefined,
                currentStock: Math.floor(currentStock),
                maxCapacity: OPERATIONAL_LIMITS.MAX_WAREHOUSE_CAPACITY,
                // location: generateWarehouseLocation(warehouseIndex),
                payloads
            });
        });
    });

    return warehouses;
};

// Generate mock purchase orders
export const generateMockPurchaseOrders = (count: number = 15): PurchaseOrder[] => {
    const orders: PurchaseOrder[] = [];
    const materials = Object.keys(MATERIALS) as MaterialType[];
    const sellers = MOCK_SELLERS;
    for (let i = 0; i < count; i++) {
        const buyer = MOCK_BUYERS[Math.floor(Math.random() * MOCK_BUYERS.length)];
        const seller = sellers[Math.floor(Math.random() * sellers.length)];
        const orderDate = randomDate(
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            new Date()
        );

        // Generate 1-3 items per order
        const itemCount = Math.floor(Math.random() * 3) + 1;
        const items = Array.from({length: itemCount}, (_, itemIndex) => {
            const material = materials[Math.floor(Math.random() * materials.length)];
            const materialData = MATERIALS[material];
            const quantity = Math.floor(Math.random() * 50000) + 10000; // 10-60 kT
            const priceVariation = 0.9 + Math.random() * 0.2; // ±10% price variation
            const agreedPricePerTon = materialData.pricePerTon * priceVariation;

            return {
                material,
                quantity,
                agreedPricePerTon,
                totalPrice: quantity * agreedPricePerTon
            };
        });

        const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0);
        const statuses: PurchaseOrder['status'][] = ['outstanding', 'fulfilled', 'cancelled'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        orders.push({
            id: `po-${i + 1}`,
            poNumber: `PO${String(i + 1).padStart(4, '0')}`,
            customerId: buyer.id,
            customerName: buyer.name,
            sellerId: seller.id,
            sellerName: seller.name,
            orderDate,
            status,
            items,
            totalValue,
            estimatedDeliveryDate: status === 'outstanding' ?
                randomDate(new Date(), new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)) :
                undefined
        });
    }

    return orders;
};

// Update the shipping orders mock data - remove vesselName
export const shippingOrdersMockData = [
  {
    id: 'so-001',
    soNumber: 'SO-2025-001',
    vesselNumber: 'VESSEL-001',  
    poReference: 'PO-2025-001',
    customerName: 'Steel Manufacturing Co.',
    customerNumber: 'CUST-001',
    estimatedArrivalDate: new Date('2025-01-15T08:00:00'),
    estimatedDepartureDate: new Date('2025-01-17T16:00:00'),
    actualArrivalDate: new Date('2025-01-15T08:30:00'),
    actualDepartureDate: null,
    status: 'arrived',
    inspectionCompleted: false,
    bunkeringCompleted: false,
    loadingCompleted: false
  },
  {
    id: 'so-002',
    soNumber: 'SO-2025-002',
    vesselNumber: 'VESSEL-002',
    poReference: 'PO-2025-002',
    customerName: 'Construction Ltd.',
    customerNumber: 'CUST-002',
    estimatedArrivalDate: new Date('2025-01-16T10:00:00'),
    estimatedDepartureDate: new Date('2025-01-18T14:00:00'),
    actualArrivalDate: null,
    actualDepartureDate: null,
    status: 'ready_for_loading',
    inspectionCompleted: true,
    bunkeringCompleted: true,
    loadingCompleted: false
  },
  {
    id: 'so-003',
    soNumber: 'SO-2025-003',
    vesselNumber: 'VESSEL-003',
    poReference: 'PO-2025-003',
    customerName: 'Steel Manufacturing Co.',
    customerNumber: 'CUST-001',
    estimatedArrivalDate: new Date('2025-01-17T12:00:00'),
    estimatedDepartureDate: new Date('2025-01-19T16:00:00'),
    actualArrivalDate: new Date('2025-01-17T12:15:00'),
    actualDepartureDate: null,
    status: 'bunkering',
    inspectionCompleted: true,
    bunkeringCompleted: false,
    loadingCompleted: false
  }
];

// Generate mock appointments
export const generateMockAppointments = (trucks: Truck[]): Appointment[] => {
    return trucks.map((truck, index) => {
        const arrivalWindow = {
            start: truck.plannedArrival,
            end: new Date(truck.plannedArrival.getTime() + 60 * 60 * 1000) // 1 hour window
        };

        let appointmentStatus: Appointment['status'] = 'scheduled';
        if (truck.status === 'EXIT') appointmentStatus = 'departed';
        else if (truck.status === 'GATE') appointmentStatus = 'arrived';
        else if (truck.status === 'WEIGHING_BRIDGE') appointmentStatus = 'arrived';
        else if (truck.status === 'WAREHOUSE') appointmentStatus = 'arrived';
        else if (truck.status === 'scheduled') appointmentStatus = 'scheduled';
        else if (truck.status === 'At the Truck Garage') appointmentStatus = 'cancelled';

        return {
            id: `appointment-${index + 1}`,
            truckId: truck.id,
            licensePlate: truck.licensePlate,
            sellerId: truck.sellerId,
            sellerName: truck.sellerName,
            material: truck.material,
            scheduledTime: truck.plannedArrival,
            arrivalWindow,
            status: appointmentStatus,
            warehouseNumber: truck.warehouseNumber || 'Unknown'
        };
    });
};

// Generate mock dashboard metrics
export const generateMockDashboardMetrics = (
    trucks: Truck[],
    warehouses: Warehouse[],
    purchaseOrders: PurchaseOrder[],
    shippingOrders: ShippingOrder[]
): DashboardMetrics => {
    const trucksOnSite = trucks.filter(t =>
        ['GATE', 'WEIGHING_BRIDGE', 'WAREHOUSE'].includes(t.status)
    ).length;

    const scheduledArrivals = trucks.filter(t => t.status === 'scheduled').length;
    const delayedTrucks = trucks.filter(t => t.status === 'GATE').length;

    const warehousesAtCapacity = warehouses.filter(w =>
        w.currentStock / w.maxCapacity > OPERATIONAL_LIMITS.WAREHOUSE_FULL_THRESHOLD
    ).length;

    const totalWarehouseCapacity = warehouses.reduce((sum, w) => sum + w.maxCapacity, 0);
    const usedWarehouseCapacity = warehouses.reduce((sum, w) => sum + w.currentStock, 0);

    const outstandingPOs = purchaseOrders.filter(po => po.status === 'outstanding').length;
    const fulfilledPOs = purchaseOrders.filter(po => po.status === 'fulfilled').length;

    const shipsInPort = shippingOrders.filter(so =>
        ['arrived', 'validated', 'bunkering', 'ready_for_loading'].includes(so.status)
    ).length;

    const pendingInspections = shippingOrders.filter(so =>
        so.inspectionCompleted === false
    ).length;

    const pendingBunkering = shippingOrders.filter(so =>
        so.bunkeringCompleted === false
    ).length;

    return {
        trucksOnSite,
        scheduledArrivals,
        delayedTrucks,
        warehousesAtCapacity,
        totalWarehouseCapacity,
        usedWarehouseCapacity,
        outstandingPOs,
        fulfilledPOs,
        shipsInPort,
        pendingInspections,
        pendingBunkering
    };
};

// Generate initial mock data
const initialTrucks = generateMockTrucks();
const initialWarehouses = generateMockWarehouses();
const initialPurchaseOrders = generateMockPurchaseOrders();
const initialShippingOrders = shippingOrdersMockData as unknown as ShippingOrder[];
const initialAppointments = generateMockAppointments(initialTrucks);
const initialDashboardMetrics = generateMockDashboardMetrics(
    initialTrucks,
    initialWarehouses,
    initialPurchaseOrders,
    initialShippingOrders
);

// Export all mock data
export const mockData = {
    trucks: initialTrucks,
    warehouses: initialWarehouses,
    purchaseOrders: initialPurchaseOrders,
    shippingOrders: initialShippingOrders,
    appointments: initialAppointments,
    dashboardMetrics: initialDashboardMetrics,
    sellers: MOCK_SELLERS,
    buyers: MOCK_BUYERS
};