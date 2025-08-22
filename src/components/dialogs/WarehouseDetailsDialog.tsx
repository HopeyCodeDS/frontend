import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  IconButton,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  Warehouse as WarehouseIcon,
  Scale as ScaleIcon,
  Schedule as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { Warehouse as WarehouseType } from '@/types';
import { useWarehouseInventory } from '@/hooks/useWarehouseData';
import { Package, X } from 'lucide-react';

interface WarehouseDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  warehouse: WarehouseType | null;
}

export function WarehouseDetailsDialog({ open, onClose, warehouse }: WarehouseDetailsDialogProps) {
  if (!warehouse) return null;

  // Using React Query to get real-time inventory data
  const { 
    data: inventoryData, 
    isLoading: inventoryLoading, 
    error: inventoryError 
  } = useWarehouseInventory(warehouse.id);

  const getCapacityLabel = () => {
    if (isOverCapacity) return 'Over Capacity';
    if (isHighCapacity) return 'High Capacity';
    return 'Normal Capacity';
  };

  const getCapacityColor = () => {
    if (isOverCapacity) return 'error';
    if (isHighCapacity) return 'warning';
    return 'success';
  };

  const capacityPercentage = (warehouse.currentStock / warehouse.maxCapacity) * 100;
  const isOverCapacity = capacityPercentage > 100;
  const isHighCapacity = capacityPercentage > 80;


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1}}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
            <WarehouseIcon />
          </Avatar>
          <Box>
          <Typography variant="h6" component="span">
            {warehouse.number}
          </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                {warehouse.sellerName}
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
            <Paper sx={{ p: 3, height: 'fit-content' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Package />
                Basic Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Warehouse Number</Typography>
                  <Typography variant="body1" fontWeight={600}>{warehouse.number}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">Seller</Typography>
                  <Typography variant="body1" fontWeight={600}>{warehouse.sellerName}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">Material Type</Typography>
                  <Chip 
                    label={warehouse.material} 
                    color="primary" 
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                
              </Box>
            </Paper>
          </Grid>


          {/* Capacity Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 'fit-content' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon />
                Capacity & Status
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Storage Capacity</Typography>
                    <Chip 
                      label={getCapacityLabel()} 
                      color={getCapacityColor() as any} 
                      size="small"
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(capacityPercentage, 100)} 
                    color={getCapacityColor() as any}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {warehouse.currentStock?.toLocaleString() || '0'} tons
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {warehouse.maxCapacity?.toLocaleString() || '0'} tons
                    </Typography>
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Current Stock</Typography>
                  <Typography variant="h4" fontWeight={700} color="primary.main">
                    {warehouse.currentStock?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">tons</Typography>
                </Box>
                
                {isHighCapacity && (
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: isOverCapacity ? 'error.dark' : 'warning.dark', 
                    borderRadius: 2,
                    color: 'white'
                  }}>
                    <Typography variant="body2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WarningIcon />
                      {isOverCapacity ? 'Overflow Capacity' : 'High Capacity Warning'}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      {isOverCapacity 
                        ? 'Warehouse is operating above maximum capacity. Only planned deliveries accepted.'
                        : 'Warehouse is approaching maximum capacity. Consider scheduling shipments.'
                      }
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Inventory Data */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon />
                  Real-time Inventory Data
                </Typography>
                
                {inventoryLoading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                )}
                
                {inventoryError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    Failed to load inventory data: {inventoryError.message}
                  </Alert>
                )}
                
                {inventoryData && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Last updated: {new Date().toLocaleTimeString()}
                    </Typography>
                    
                    {warehouse.payloads && warehouse.payloads.length > 0 ? (
                      <List dense>
                        {warehouse.payloads.map((payload, index) => (
                          <React.Fragment key={index}>
                            <ListItem>
                              <ListItemText
                                primary={
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {payload.rawMaterialName.replace('-', ' ')} - {payload.payloadWeight.toFixed(2)} tons
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="caption" color="text.secondary">
                                    Delivered: {new Date(payload.deliveryTime).toLocaleString()}
                                  </Typography>
                                }
                              />
                            </ListItem>
                            {index < warehouse.payloads.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No payloads recorded yet.
                      </Typography>
                    )}
                  </Box>
                )}
               </Paper>
          </Grid>
        </Grid>  
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained"
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
