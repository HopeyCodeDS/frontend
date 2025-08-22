import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { TrendingUp as TrendingUpIcon, Visibility as ViewIcon, Warning as AlertTriangleIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { Package, Warehouse } from 'lucide-react';
import { Warehouse as WarehouseType } from '@/types';
import { AddWarehouseDialog } from '@/components/dialogs/AddWarehouseDialog';
import { WarehouseDetailsDialog } from '@/components/dialogs/WarehouseDetailsDialog';
import { useWarehouses, useCreateWarehouse } from '@/hooks/useWarehouseData';
import { useToast } from '@/hooks/use-toast';

const WarehouseCard = ({ warehouse, onViewDetails }: { warehouse: WarehouseType, onViewDetails: () => void }) => {
  const utilizationPercent = (warehouse.currentStock / warehouse.maxCapacity) * 100;
  
  const getUtilizationColor = (percent: number) => {
    if (percent >= 90) return 'error';
    if (percent >= 75) return 'warning';
    return 'success';
  };

  const getProgressBarColor = (percent: number) => {
    if (percent >= 90) return '#ef4444';
    if (percent >= 75) return '#f59e0b';
    return '#10b981';
  };

  return (
    <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            <Warehouse />
          </Avatar>
        }
        title={`${warehouse.number}`}
        subheader={warehouse.sellerName}
        action={
          <Chip
            label="Active"
            color="primary"
            size="small"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              fontWeight: 600
            }}
          />
        }
        titleTypographyProps={{ variant: 'h6', color: 'text.primary' }}
        subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Capacity Utilization Section */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
              Capacity Utilization
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'bold',
                color: getUtilizationColor(utilizationPercent) === 'error' ? 'error.main' :
                  getUtilizationColor(utilizationPercent) === 'warning' ? 'warning.main' : 'success.main'
              }}
            >
              {utilizationPercent.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"  
            value={utilizationPercent}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: getProgressBarColor(utilizationPercent),
                borderRadius: 4,
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {warehouse.currentStock?.toLocaleString() || '0'} tons
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {warehouse.maxCapacity?.toLocaleString() || '0'} tons max
            </Typography>
          </Box>
        </Box>

        {warehouse.payloads && Array.isArray(warehouse.payloads) && warehouse.payloads.length > 0 ? (
          <Box>
            <Typography variant="subtitle2" sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 2,
              color: 'text.primary',
              fontWeight: 600
            }}>
              <Package />
              Recent Payloads ({warehouse.payloads.length})
            </Typography>
            
            <Box sx={{
              bgcolor: 'rgba(255,255,255,0.05)',
              borderRadius: 1,
              border: '1px solid rgba(255,255,255,0.1)',
              p: 1.5,
              maxHeight: 120,
              overflow: 'auto'
            }}>
              <List dense sx={{ p: 0 }}>
                {warehouse.payloads.slice(0, 3).map((payload, index) => (
                  <ListItem key={index} sx={{
                    py: 0.5,
                    px: 1,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.05)'
                    }
                  }}>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{
                          color: 'text.primary',
                          fontWeight: 500,
                          textTransform: 'capitalize'
                        }}>
                          {payload.rawMaterialName ? payload.rawMaterialName.replace('_', ' ') : 'Unknown Material'}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{
                          color: 'text.secondary',
                          fontWeight: 600
                        }}>
                          {payload.payloadWeight ? `${payload.payloadWeight.toFixed(2)} tons` : 'Weight unknown'}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              
              {warehouse.payloads.length > 3 && (
                <Box sx={{
                  textAlign: 'center',
                  pt: 1,
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  mt: 1
                }}>
                  <Typography variant="caption" sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}>
                    +{warehouse.payloads.length - 3} more payloads
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          // Show when no payloads
          <Box>
            <Typography variant="subtitle2" sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 2,
              color: 'text.secondary',
              fontWeight: 500
            }}>
              <Package />
              No Payloads Available
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {!warehouse.payloads ? 'Payloads data not available' : 
               warehouse.payloads.length === 0 ? 'No payloads recorded yet' : 
               'Payloads data format invalid'}
            </Typography>
          </Box>
        )}

        {/* View Details Button */}
        <Button
          variant="outlined"
          size="medium"
          startIcon={<ViewIcon />}
          fullWidth
          sx={{ mb: 1, width: '100%', flex: 1 }}
          onClick={onViewDetails}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

const validateWarehouseData = (warehouse: any) => {
  return {
    ...warehouse,
    currentStock: warehouse.currentStock || 0,
    maxCapacity: warehouse.maxCapacity || 0,
    payloads: Array.isArray(warehouse.payloads) ? warehouse.payloads : [],
    number: warehouse.number || 'Unknown',
    sellerName: warehouse.sellerName || 'Unknown Seller'
  };
};

export default function Warehouses() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseType | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Using React Query to fetch warehouse data
  const { 
    data: warehouses = [], 
    isLoading, 
    error, 
    refetch 
  } = useWarehouses();

  // Ensure warehouses is always an array and add safety checks
  const warehouseList = Array.isArray(warehouses) ? warehouses : [];
  
  // Debug log here, after data is processed
  React.useEffect(() => {
    if (warehouseList.length > 0) {
      console.log('Backend warehouse structure:', warehouseList[0]);
      console.log('Payloads structure:', warehouseList[0]?.payloads);
    }
  }, [warehouseList]);
  
  // Calculate metrics with safety checks
  const totalCapacity = warehouseList.reduce((sum, w) => sum + (w.maxCapacity || 0), 0);
  const totalStock = warehouseList.reduce((sum, w) => sum + (w.currentStock || 0), 0);
  const overCapacityWarehouses = warehouseList.filter(w => 
    w.maxCapacity > 0 && (w.currentStock / w.maxCapacity) > 0.9
  ).length;

  // Debug log right after your useWarehouses hook
  React.useEffect(() => {
    if (warehouseList.length > 0) {
      const firstWarehouse = warehouseList[0];
      console.log('Full warehouse object:', firstWarehouse);
      console.log('Payloads array:', firstWarehouse.payloads);
      console.log('Payloads type:', typeof firstWarehouse.payloads);
      console.log(' Payloads length:', firstWarehouse.payloads?.length);
      if (firstWarehouse.payloads && firstWarehouse.payloads.length > 0) {
        console.log('First payload:', firstWarehouse.payloads[0]);
        console.log('First payload keys:', Object.keys(firstWarehouse.payloads[0]));
      }
    }
  }, [warehouseList]);
  
  // Validate and clean the data
  const validatedWarehouses = warehouseList.map(validateWarehouseData);

  const handleViewDetails = (warehouse: WarehouseType) => {
    setSelectedWarehouse(warehouse);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsDialogOpen(false);
    setSelectedWarehouse(null);
  };

  const handleWarehouseAdded = () => {
    toast({
      title: "Success",
      description: "Warehouse added successfully. Refreshing data...",
      variant: "default"
    });
    refetch();
  };

  const handleRefresh = async () => {
    await refetch();
  };

  // Handle loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load warehouse data: {error.message}
        </Alert>
        <Button variant="contained" onClick={handleRefresh}>
          Retry
        </Button>
      </Box>
    );
  }

  // Debug logging
  console.log('Warehouse data:', {
    isArray: Array.isArray(warehouses),
    length: warehouseList.length,
    data: warehouseList
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
            Warehouse Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor warehouse capacity and inventory status
          </Typography>
          {/* Data Source Indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Typography variant="caption" color="info.main">
              Data source: {Array.isArray(warehouses) && warehouses.length > 0 ? 'Backend' : 'Mock Data'}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleRefresh}
            disabled={isLoading}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        <AddWarehouseDialog onWarehouseAdded={handleWarehouseAdded}>
          <Button
            variant="contained"
            startIcon={<Warehouse />}
            size="large"
          >
            Add Warehouse
          </Button>
        </AddWarehouseDialog>
      </Box>
    </Box>

    {/* Show loading indicator if refreshing */}
    {isLoading && warehouses.length > 0 && (
        <LinearProgress sx={{ mb: 2 }} />
      )}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardHeader
              title="Total Warehouses"
              titleTypographyProps={{ variant: 'h6', color: 'text.primary' }}
            />
            <CardContent>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                {warehouseList.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                active facilities
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardHeader
              title="Total Capacity"
              titleTypographyProps={{ variant: 'h6', color: 'text.primary' }}
            />
            <CardContent>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                {totalCapacity.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                tons
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardHeader
              title="Current Stock"
              titleTypographyProps={{ variant: 'h6', color: 'text.primary' }}
            />
            <CardContent>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                {totalStock.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <TrendingUpIcon fontSize="small" color="success" />
                {totalCapacity > 0 ? ((totalStock / totalCapacity) * 100).toFixed(1) : '0'}% utilized
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardHeader
              title="High Capacity"
              titleTypographyProps={{ variant: 'h6', color: 'text.primary' }}
            />
            <CardContent>
              <Typography variant="h3" component="div" sx={{
                fontWeight: 'bold',
                mb: 1,
                color: overCapacityWarehouses > 0 ? 'warning.main' : 'text.primary'
              }}>
                {overCapacityWarehouses}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <AlertTriangleIcon fontSize="small" color="warning" />
                warehouses &gt;90%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Warehouses Grid - Use validated data */}
      <Grid container spacing={3}>
        {validatedWarehouses.map((warehouse) => (
          <Grid item xs={12} sm={6} lg={4} key={warehouse.id}>
            <WarehouseCard
              warehouse={warehouse}
              onViewDetails={() => handleViewDetails(warehouse)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Warehouse Details Dialog */}
      <WarehouseDetailsDialog
        open={isDetailsDialogOpen}
        onClose={handleCloseDetails}
        warehouse={selectedWarehouse}
      />
    </Box>
  );
}