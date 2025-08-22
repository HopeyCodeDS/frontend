import {Material, MaterialType} from '@/types';

// Material definitions with pricing and storage costs
export const MATERIALS: Record<MaterialType, Material> = {
    gypsum: {
        type: 'gypsum',
        name: 'Gypsum',
        pricePerTon: 13,
        storageCostPerTonPerDay: 1,
        color: 'hsl(var(--gypsum))',
        description: 'Soft sulfate mineral for construction and agriculture'
    },
    'iron-ore': {
        type: 'iron-ore',
        name: 'Iron Ore',
        pricePerTon: 110,
        storageCostPerTonPerDay: 5,
        color: 'hsl(var(--iron-ore))',
        description: 'Essential raw material for steel production'
    },
    cement: {
        type: 'cement',
        name: 'Cement',
        pricePerTon: 95,
        storageCostPerTonPerDay: 3,
        color: 'hsl(var(--cement))',
        description: 'Binding agent for construction materials'
    },
    petcoke: {
        type: 'petcoke',
        name: 'Petcoke',
        pricePerTon: 210,
        storageCostPerTonPerDay: 10,
        color: 'hsl(var(--petcoke))',
        description: 'Carbon-rich fuel for industrial processes'
    },
    slag: {
        type: 'slag',
        name: 'Slag',
        pricePerTon: 160,
        storageCostPerTonPerDay: 7,
        color: 'hsl(var(--slag))',
        description: 'Byproduct used in construction and cement'
    }
};

// Operational constants
export const OPERATIONAL_LIMITS = {
    TRUCKS_PER_HOUR: 40,
    MAX_WAREHOUSE_CAPACITY: 500000, // 500 kT in tons
    WAREHOUSE_FULL_THRESHOLD: 0.8, // 80%
    MAX_SHIPPING_ORDER: 150000, // 150 kT in tons
    MAX_BUNKERING_OPERATIONS_PER_DAY: 6,
    COMMISSION_PERCENTAGE: 0.01, // 1%
    STORAGE_CALCULATION_TIME: '09:00', // Daily storage calculation at 9 AM
} as const;

// Truck status configurations
export const TRUCK_STATUS_CONFIG = {
    scheduled: {
      label: 'Scheduled',
      color: 'hsl(var(--muted-foreground))',
      bgColor: 'hsl(var(--muted))',
      description: 'Appointment scheduled, awaiting arrival'
    },
    GATE: {
      label: 'Arrived',
      color: 'hsl(var(--primary))',
      bgColor: 'hsl(var(--primary) / 0.1)',
      description: 'Truck has arrived and entered the facility'
    },
    WEIGHING_BRIDGE: {
      label: 'Weighing',
      color: 'hsl(var(--warning))',
      bgColor: 'hsl(var(--warning) / 0.1)',
      description: 'Currently at weighing bridge'
    },
    WAREHOUSE: {
      label: 'At Warehouse',
      color: 'hsl(var(--secondary))',
      bgColor: 'hsl(var(--secondary) / 0.1)',
      description: 'Unloading at warehouse'
    },
    EXIT: {
      label: 'Exited',
      color: 'hsl(var(--success))',
      bgColor: 'hsl(var(--success) / 0.1)',
      description: 'Delivery completed, exited facility'
    },
    'At the Truck Garage': {
        label: 'At Garage',
        color: 'hsl(var(--info))',
        bgColor: 'hsl(var(--info) / 0.1)',
        description: 'Truck is at the garage for maintenance'
      }
  } as const;

// Warehouse layout constants for visualization
export const WAREHOUSE_LAYOUT = {
    GRID_WIDTH: 1200,
    GRID_HEIGHT: 800,
    WAREHOUSE_MIN_WIDTH: 180,
    WAREHOUSE_MIN_HEIGHT: 120,
    WAREHOUSE_MARGIN: 20,
    WAREHOUSES_PER_ROW: 5,
} as const;

// Date and time formatting
export const DATE_FORMATS = {
    DISPLAY_DATE: 'MMM dd, yyyy',
    DISPLAY_TIME: 'HH:mm',
    DISPLAY_DATETIME: 'MMM dd, yyyy HH:mm',
    ISO_DATE: 'yyyy-MM-dd',
    ISO_DATETIME: "yyyy-MM-dd'T'HH:mm:ss'Z'",
} as const;

// API endpoints (for future backend integration)
export const API_ENDPOINTS = {
    TRUCKS: '/api/trucks',
    WAREHOUSES: '/api/warehouses',
    APPOINTMENTS: '/api/appointments',
    PURCHASE_ORDERS: '/api/purchase-orders',
    SHIPPING_ORDERS: '/api/shipping-orders',
    INVOICES: '/api/invoices',
    DASHBOARD_METRICS: '/api/dashboard/metrics',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
    DASHBOARD_PREFERENCES: 'kdg-dashboard-preferences',
    SELECTED_DATE: 'kdg-selected-date',
    FILTERS: 'kdg-filters',
} as const;

// Refresh intervals (in milliseconds)
export const REFRESH_INTERVALS = {
    DASHBOARD_METRICS: 30000, // 30 seconds
    TRUCK_STATUS: 15000, // 15 seconds
    WAREHOUSE_DATA: 60000, // 1 minute
    OPERATIONS: 30000, // 30 seconds
} as const;

// Validation constants
export const VALIDATION = {
    LICENSE_PLATE_REGEX: /^[A-Z0-9-]{6,12}$/,
    VESSEL_NUMBER_REGEX: /^[A-Z0-9]{6,20}$/,
    MIN_TRUCK_WEIGHT: 0.25, // 250 kg minimum
    MAX_TRUCK_WEIGHT: 50, // 50 tons maximum
    APPOINTMENT_ADVANCE_HOURS: 2, // Minimum 2 hours advance booking
} as const;