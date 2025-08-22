import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWarehouses } from './useWarehouseData';
import { useTruckData } from './useTruckData';
import { useAppointments } from './useAppointmentsData';
import { usePurchaseOrders } from './usePurchaseOrderData';
import { useShippingOrders } from './useShippingOrderData';

export function useDashboardData() {
  // Use all the existing hooks to fetch real data
  const { data: warehouses = [], isLoading: warehousesLoading } = useWarehouses();
  const { trucks = [], loading: trucksLoading } = useTruckData();
  const { data: appointments = [], isLoading: appointmentsLoading } = useAppointments();
  const { data: purchaseOrders = [], isLoading: purchaseOrdersLoading } = usePurchaseOrders();
  const { data: shippingOrders = [], isLoading: shippingOrdersLoading } = useShippingOrders();

  // Calculate real-time metrics from actual data
  const metrics = useMemo(() => {
    const trucksOnSite = trucks.filter(t => 
      ['GATE', 'WEIGHING_BRIDGE', 'WAREHOUSE'].includes(t.status)
    ).length;
    
    const trucksAtBridge = trucks.filter(t => t.status === 'WEIGHING_BRIDGE').length;
    const trucksAtBelt = trucks.filter(t => t.status === 'WAREHOUSE').length;
    const trucksAtGate = trucks.filter(t => t.status === 'GATE').length;
    
    const warehouseCapacity = warehouses.length > 0 
      ? Math.round((warehouses.reduce((total, w) => total + (w.maxCapacity - w.currentStock), 0) / 
                    warehouses.reduce((total, w) => total + w.maxCapacity, 0)) * 100)
      : 0;
    
    const warehousesAtCapacity = warehouses.filter(w => 
      (w.currentStock / w.maxCapacity) >= 0.8
    ).length;
    
    const outstandingPOs = purchaseOrders.filter(po => 
      po.status === 'outstanding'
    ).length;
    
    const pendingInspections = shippingOrders.filter(so => 
      so.status === 'validated' && !so.inspectionCompleted
    ).length;
    
    const pendingBunkering = shippingOrders.filter(so => 
      so.status === 'bunkering' && !so.bunkeringCompleted
    ).length;
    
    return {
      trucksOnSite,
      trucksAtBridge,
      trucksAtBelt,
      trucksAtGate,
      warehouseCapacity,
      warehousesAtCapacity,
      outstandingPOs,
      pendingInspections,
      pendingBunkering
    };
  }, [trucks, warehouses, purchaseOrders, shippingOrders]);

  // Get today's appointments
  const todayAppointments = useMemo(() => {
    const today = new Date();
    return appointments
      .filter(apt => apt.scheduledTime.toDateString() === today.toDateString())
      .slice(0, 5);
  }, [appointments]);

  // Get recent alerts based on real data
  const alerts = useMemo(() => {
    const alerts = [];
    
    // Warehouse capacity alerts
    const highCapacityWarehouses = warehouses.filter(w => 
      (w.currentStock / w.maxCapacity) >= 0.95
    );
    if (highCapacityWarehouses.length > 0) {
      alerts.push({
        type: 'warning',
        message: `Warehouse ${highCapacityWarehouses[0].number} at ${Math.round((highCapacityWarehouses[0].currentStock / highCapacityWarehouses[0].maxCapacity) * 100)}% capacity`,
        time: 'Just now'
      });
    }
    
     // Vessel departed status alert
     const departedVessels = shippingOrders.filter(so => 
        so.status === 'departed' && so.actualDepartureDate
      );
      if (departedVessels.length > 0) {
        const vessel = departedVessels[0];
        const departureTime = vessel.actualDepartureDate instanceof Date 
          ? vessel.actualDepartureDate 
          : new Date(vessel.actualDepartureDate || '');
        
        alerts.push({
          type: 'success',
          message: `Vessel ${vessel.vesselNumber} has departed successfully`,
          time: 'Just now',
          location: 'Port',
          vesselDetails: {
            ...vessel,
            departureTime: departureTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            departureDate: departureTime.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })
          }
        });
      }

    // Truck location notifications
    const trucksAtBridge = trucks.filter(t => t.status === 'WEIGHING_BRIDGE');
    if (trucksAtBridge.length > 0) {
      const truck = trucksAtBridge[0];
      alerts.push({
        type: 'info',
        message: `Truck ${truck.licensePlate} currently at Weighing Bridge`,
        time: 'Just now',
        location: 'Weighing Bridge',
        truckDetails: truck
      });
    }

    const trucksAtWarehouse = trucks.filter(t => t.status === 'WAREHOUSE');
    if (trucksAtWarehouse.length > 0) {
      const truck = trucksAtWarehouse[0];
      alerts.push({
        type: 'success',
        message: `Truck ${truck.licensePlate} unloading at Warehouse ${truck.warehouseNumber || 'Unknown'}`,
        time: 'Just now',
        location: `Warehouse ${truck.warehouseNumber || 'Unknown'}`,
        truckDetails: truck
      });
    }

    const trucksAtGate = trucks.filter(t => t.status === 'GATE');
    if (trucksAtGate.length > 0) {
      const truck = trucksAtGate[0];
      alerts.push({
        type: 'warning',
        message: `Truck ${truck.licensePlate} waiting at Gate for processing`,
        time: 'Just now',
        location: 'Gate',
        truckDetails: truck
      });
    }

    // Default alerts if no real alerts exist
    if (alerts.length === 0) {
      alerts.push({
        type: 'info',
        message: 'All systems operating normally',
        time: 'Just now'
      });
    }
    
    return alerts;
  }, [warehouses, trucks, shippingOrders]);

  // Overall loading state
  const isLoading = warehousesLoading || trucksLoading || appointmentsLoading || 
                   purchaseOrdersLoading || shippingOrdersLoading;

  return {
    warehouses,
    trucks,
    appointments,
    purchaseOrders,
    shippingOrders,
    metrics,
    todayAppointments,
    alerts,
    isLoading
  };
}
