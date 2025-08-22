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
  LinearProgress
} from '@mui/material';
import {
  LocalShipping as ShipIcon,
  LocationOn as LocationIcon,
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { TrendingUp, MapPin, X } from 'lucide-react';
import { ShippingOrder } from '@/types';
import { 
  useMatchShippingOrder, 
  useCompleteInspection, 
  useCompleteBunkering 
} from '@/hooks/useShippingOrderData';
import { useState } from 'react';

interface ShippingOrderDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  shippingOrder: ShippingOrder | null;
}

export function ShippingOrderDetailsDialog({ 
  open, 
  onClose, 
  shippingOrder 
}: ShippingOrderDetailsDialogProps) {
  const matchShippingOrderMutation = useMatchShippingOrder();
  const completeInspectionMutation = useCompleteInspection();
  const completeBunkeringMutation = useCompleteBunkering();
  
  const [foremanSignature, setForemanSignature] = useState('');
  const [inspectorSignature, setInspectorSignature] = useState('');
  const [bunkeringOfficerSignature, setBunkeringOfficerSignature] = useState('');

  const handleMatchShippingOrder = async () => {
    if (shippingOrder && foremanSignature) {
      try {
        await matchShippingOrderMutation.mutateAsync({ 
          shippingOrderId: shippingOrder.id, 
          foremanSignature 
        });
        onClose();
      } catch (error) {
        console.error('Failed to match shipping order:', error);
      }
    }
  };

  const handleCompleteInspection = async () => {
    if (shippingOrder && inspectorSignature) {
      try {
        await completeInspectionMutation.mutateAsync({ 
          shippingOrderId: shippingOrder.id, 
          inspectorSignature 
        });
        onClose();
      } catch (error) {
        console.error('Failed to complete inspection:', error);
      }
    }
  };

  const handleCompleteBunkering = async () => {
    if (shippingOrder && bunkeringOfficerSignature) {
      try {
        await completeBunkeringMutation.mutateAsync({ 
          shippingOrderId: shippingOrder.id, 
          bunkeringOfficerSignature 
        });
        onClose();
      } catch (error) {
        console.error('Failed to complete bunkering:', error);
      }
    }
  };

  if (!shippingOrder) return null;

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
      case 'pending':
        return 'warning';
      case 'in_transit':
        return 'info';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getOperationStatus = (operation: string, completed: boolean) => {
    return completed ? 'Completed' : 'Pending';
  };

  const getOperationColor = (completed: boolean) => {
    return completed ? 'success' : 'warning';
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
            <ShipIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" component="span">
              Shipping Order {shippingOrder.soNumber || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'block' }}>
              Vessel: {shippingOrder.vesselNumber || 'N/A'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          {/* Left Column - Basic Info */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 'fit-content' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MapPin />
                Shipment Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">SO Number</Typography>
                  <Typography variant="body1" fontWeight={600}>{shippingOrder.soNumber || 'N/A'}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">Vessel Number</Typography>
                  <Typography variant="body1" fontWeight={600}>{shippingOrder.vesselNumber || 'N/A'}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">PO Reference</Typography>
                  <Typography variant="body1" fontWeight={600}>{shippingOrder.poReference || 'N/A'}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">Customer Number</Typography>
                  <Typography variant="body1" fontWeight={600}>{shippingOrder.customerNumber || 'N/A'}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">Estimated Arrival</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatDate(shippingOrder.estimatedArrivalDate)}
                  </Typography>
                </Box>
                
                {shippingOrder.actualArrivalDate && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">Actual Arrival</Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formatDate(shippingOrder.actualArrivalDate)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Operations & Status */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 'fit-content' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp />
                Operations Status
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Overall Status</Typography>
                  <Chip 
                    label={shippingOrder.status || 'Pending'} 
                    color={getStatusColor(shippingOrder.status) as any}
                    size="medium"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                
                {/* Inspection Operation */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Inspection Operation</Typography>
                    <Chip 
                      label={getOperationStatus('IO', shippingOrder.inspectionCompleted)} 
                      color={getOperationColor(shippingOrder.inspectionCompleted) as any}
                      size="small"
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={shippingOrder.inspectionCompleted ? 100 : 0}
                    color={shippingOrder.inspectionCompleted ? 'success' : 'warning'}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
                
                {/* Bunkering Operation */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Bunkering Operation</Typography>
                    <Chip 
                      label={getOperationStatus('BO', shippingOrder.bunkeringCompleted)} 
                      color={getOperationColor(shippingOrder.bunkeringCompleted) as any}
                      size="small"
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={shippingOrder.bunkeringCompleted ? 100 : 0}
                    color={shippingOrder.bunkeringCompleted ? 'success' : 'warning'}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
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
