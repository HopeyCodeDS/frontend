import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Paper,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  LocalShipping as TruckIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as TimeIcon,
  X
} from '@mui/icons-material';
import { Truck } from '@/types';

interface TruckDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  truck: Truck;
}

export function TruckDetailsDialog({ open, onClose, truck }: TruckDetailsDialogProps) {
  if (!truck) return null;

  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'on_site':
        return 'success';
      case 'in_transit':
        return 'info';
      case 'loading':
        return 'warning';
      case 'unloading':
        return 'warning';
      case 'weighing':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'on_site':
        return <CheckCircleIcon color="success" />;
      case 'in_transit':
        return <TrendingUpIcon color="info" />;
      case 'loading':
      case 'unloading':
        return <TimeIcon color="warning" />;
      case 'weighing':
        return <ScheduleIcon color="info" />;
      case 'completed':
        return <CheckCircleIcon color="success" />;
      default:
        return <TimeIcon />;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <TruckIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" component="span">
              Truck {truck.licensePlate || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'block' }}>
              {truck.truckType || 'N/A'} • {truck.status || 'Unknown Status'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: 'fit-content' }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TruckIcon color="primary" />
                Basic Information
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">License Plate</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {truck.licensePlate || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Truck Type</Typography>
                <Typography variant="body1">
                  {truck.truckType || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Current Status</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  {getStatusIcon(truck.status)}
                  <Chip 
                    label={truck.status || 'Unknown'} 
                    color={getStatusColor(truck.status) as any}
                    size="small"
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Material Type</Typography>
                <Typography variant="body1">
                  {truck.material || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Payload (Tons)</Typography>
                <Typography variant="body1">
                  {truck.netWeight || 'N/A'} tons
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Location & Timing */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: 'fit-content' }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon color="primary" />
                Location & Timing
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Current Location</Typography>
                <Typography variant="body1">
                  {truck.status || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Assigned Warehouse</Typography>
                <Typography variant="body1">
                  {truck.warehouseNumber || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Arrival Time</Typography>
                <Typography variant="body1">
                  {truck.actualArrival ? formatDate(truck.actualArrival) : 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Planned Arrival</Typography>
                <Typography variant="body1">
                  {truck.plannedArrival ? formatDate(truck.plannedArrival) : 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Departure Time</Typography>
                <Typography variant="body1">
                  {truck.actualDeparture ? formatDate(truck.actualDeparture) : 'N/A'}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Weighing Information */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon color="primary" />
                Weighing Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="h6" color="primary">
                      {truck.grossWeight || '0'} tons
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Gross Weight</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="h6" color="secondary">
                      {truck.tareWeight || '0'} tons
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Tare Weight</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="h6" color="success">
                      {truck.netWeight || '0'} tons
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Net Weight</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} variant="outlined"
          startIcon={<X />}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 600,
            px: 3,
            '&:hover': {
              bgcolor: 'primary.dark',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }
            }}
          >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
