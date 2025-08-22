import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Chip,
  Button,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  LocalShipping as TruckIcon,
  LocationOn as LocationIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Apartment
} from '@mui/icons-material';

import { Truck as TruckType } from '@/types';
import { MATERIALS, TRUCK_STATUS_CONFIG } from '@/lib/constants';
import { TruckDetailsDialog } from '@/components/dialogs/TruckDetailsDialog';
import { useTruckData } from '@/hooks/useTruckData';

const TruckCard = ({ truck, onViewDetails }: { truck: TruckType, onViewDetails: () => void }) => {
  const statusConfig = TRUCK_STATUS_CONFIG[truck.status as keyof typeof TRUCK_STATUS_CONFIG];
  
  // Safe date handling
  const formatTime = (date: Date | undefined) => {
    if (!date) return 'Pending';
    try {
      return date.toLocaleTimeString();
    } catch {
      return 'Invalid Date';
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Pending';
    try {
      return date.toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };
  
  return (
    <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: statusConfig?.color || 'grey.500' }}>
            <TruckIcon />
          </Avatar>
        }
        title={`Truck - ${truck.licensePlate}`}
        subheader={`${MATERIALS[truck.material as keyof typeof MATERIALS]?.name || truck.material}`}
        action={
          <Chip 
            label={statusConfig?.label || truck.status} 
            color={statusConfig?.color as any || 'default'}
            size="small"
            variant="outlined"
          />
        }
        titleTypographyProps={{ variant: 'h6' }}
        subheaderTypographyProps={{ variant: 'body2' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Apartment fontSize="small" />
            <Typography variant="body2">
              {truck.sellerName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {truck.warehouseNumber}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon fontSize="small" color="action" />
            <Typography variant="body2">
              PlannedArrival: {formatTime(truck.plannedArrival)}
            </Typography>
          </Box>
          {truck.actualArrival && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventIcon fontSize="small" color="action" />
              <Typography variant="body2">
                ActualArrival: {formatTime(truck.actualArrival)}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<ViewIcon />}
            fullWidth
            onClick={onViewDetails}
          >
            View Details
          </Button>
          <IconButton size="small" color="primary">
            <EditIcon />
          </IconButton>
          <IconButton size="small" color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function Trucks() {
  const {
    trucks,
    loading,
    error,
    pagination,
    realTimeMetrics,
    deleteTruck,
    updateTruckStatus
  } = useTruckData();

  // Debug logs to see what's happening
  console.log('🚛 All trucks:', trucks);
  console.log('🚛 Truck statuses:', trucks.map(t => t.status));
  console.log('🚛 TRUCK_STATUS_CONFIG keys:', Object.keys(TRUCK_STATUS_CONFIG));

  const [selectedTruck, setSelectedTruck] = useState<TruckType | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Use real-time metrics if available, fallback to calculated values
  const metrics = realTimeMetrics || {
    totalTrucks: trucks.length,
    activeTrucks: trucks.filter(t => t.status === 'scheduled' || t.status === 'GATE' || t.status === 'WEIGHING_BRIDGE' || t.status === 'WAREHOUSE').length,
    completedTrucks: trucks.filter(t => t.status === 'EXIT').length,
    trucksAtGate: trucks.filter(t => t.status === 'GATE').length
  };

  const handleViewDetails = (truck: TruckType) => {
    setSelectedTruck(truck);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
    setSelectedTruck(null);
  };

  const handleDeleteTruck = async (truckId: string) => {
    if (window.confirm('Are you sure you want to delete this truck?')) {
      const success = await deleteTruck(truckId);
      if (success) {
        // Success feedback could be shown here
      }
    }
  };

  // Show error if there's an API error
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
        </Alert>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  // Show loading state
  if (loading && trucks.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading trucks...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Truck Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage truck fleet operations
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<TruckIcon />}
          size="large"
        >
          Add New Truck
        </Button>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardHeader
              title="Total Trucks"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {metrics.totalTrucks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                in fleet
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardHeader
              title="Active Trucks"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                {metrics.activeTrucks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                currently operating
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardHeader
              title="Completed"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'success.main' }}>
                {metrics.completedTrucks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                successfully completed deliveries
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardHeader
              title="Trucks at Gate"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                {metrics.trucksAtGate}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                awaiting processing
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* View Mode Toggle */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Button
          variant={viewMode === 'cards' ? 'contained' : 'outlined'}
          onClick={() => setViewMode('cards')}
        >
          Cards View
        </Button>
        <Button
          variant={viewMode === 'table' ? 'contained' : 'outlined'}
          onClick={() => setViewMode('table')}
        >
          Table View
        </Button>
      </Box>

      {/* Content */}
      {viewMode === 'cards' ? (
        <Grid container spacing={3}>
          {trucks.map((truck) => (
            <Grid item xs={12} sm={6} lg={4} key={truck.id}>
              <TruckCard 
                truck={truck} 
                onViewDetails={() => handleViewDetails(truck)} 
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>License Plate</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Material</TableCell>
                <TableCell>Warehouse</TableCell>
                <TableCell>Seller</TableCell>
                <TableCell>Arrival Time</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trucks.map((truck) => (
                <TableRow key={truck.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TruckIcon color="primary" />
                      {truck.licensePlate}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={TRUCK_STATUS_CONFIG[truck.status as keyof typeof TRUCK_STATUS_CONFIG]?.label || truck.status} 
                      color={TRUCK_STATUS_CONFIG[truck.status as keyof typeof TRUCK_STATUS_CONFIG]?.color as any || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{MATERIALS[truck.material]?.name || truck.material}</TableCell>
                  <TableCell>{truck.warehouseNumber || 'Not assigned'}</TableCell>
                  <TableCell>{truck.sellerName}</TableCell>
                  <TableCell>{truck.plannedArrival ? truck.plannedArrival.toLocaleTimeString() : 'Pending'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="View Details">
                        <IconButton size="small" color="primary" onClick={() => handleViewDetails(truck)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteTruck(truck.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Truck Details Dialog */}
      <TruckDetailsDialog
        open={detailsDialogOpen}
        onClose={handleCloseDetails}
        truck={selectedTruck as TruckType}
        onTruckUpdate={updateTruckStatus}
      />
    </Box>
  );
}