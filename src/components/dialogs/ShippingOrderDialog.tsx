import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Grid
} from '@mui/material';
import { Ship } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSubmitShippingOrder } from '@/hooks/useShippingOrderData';

interface ShippingOrderDialogProps {
  children: React.ReactNode;
}

interface ShippingOrderFormData {
  soNumber: string;
  vesselNumber: string;
  customerNumber: string;
  purchaseOrderId: string;
  estimatedArrival: Date;
  estimatedDeparture: Date;
  actualArrival: Date;
}

export function ShippingOrderDialog({ children }: ShippingOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ShippingOrderFormData>({
    soNumber: '',
    vesselNumber: '',
    customerNumber: '',
    purchaseOrderId: '',
    estimatedArrival: new Date(),
    estimatedDeparture: new Date(Date.now() + 24 * 60 * 60 * 1000),
    actualArrival: new Date()
  });
  const [errors, setErrors] = useState<Partial<ShippingOrderFormData>>({});


  // Use React Query mutation hook
  const createShippingOrderMutation = useSubmitShippingOrder();
  const { toast } = useToast();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      soNumber: '',
      vesselNumber: '',
      customerNumber: '',
      purchaseOrderId: '',
      estimatedArrival: new Date(),
      estimatedDeparture: new Date(Date.now() + 24 * 60 * 60 * 1000),
      actualArrival: new Date()
    });
    setErrors({});
    createShippingOrderMutation.reset();
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingOrderFormData> = {};

    if (!formData.soNumber.trim()) {
      newErrors.soNumber = 'SO Number is required';
    }
    if (!formData.vesselNumber.trim()) {
      newErrors.vesselNumber = 'Vessel number is required';
    }

    if (!formData.customerNumber.trim()) {
      newErrors.customerNumber = 'Customer number is required';
    }

    if (!formData.purchaseOrderId.trim()) {
      newErrors.purchaseOrderId = 'Purchase Order ID is required';
    }
    

    setErrors(newErrors);
    createShippingOrderMutation.reset();

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Format the request to match your backend DTO exactly
      const requestData = {
        shippingOrderNumber: formData.soNumber,           
        purchaseOrderReference: formData.purchaseOrderId, 
        vesselNumber: formData.vesselNumber,
        customerNumber: formData.customerNumber,
        estimatedArrivalDate: formatDateForBackend(formData.estimatedArrival),     
        estimatedDepartureDate: formatDateForBackend(formData.estimatedDeparture),
        actualArrivalDate: formatDateForBackend(formData.actualArrival)
      };

      console.log('Creating shipping order:', requestData);
      
      // Use React Query mutation to create shipping order
      await createShippingOrderMutation.mutateAsync(requestData);
      
      // Show success message
      toast({
        title: "Success",
        description: "Shipping order created successfully!",
      });
      
      handleClose();
      
    } catch (error) {
      console.error('Error creating shipping order:', error);
      toast({
        title: "Error",
        description: "Failed to create shipping order. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Helper function to format dates for backend
  const formatDateForBackend = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <>
      <Box onClick={handleOpen}>
        {children}
      </Box>
      
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          pb: 1
        }}>
          <Ship size={24} color="#4ade80" />
          <Typography variant="h6" component="span">
            New Shipping Order
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create a new shipping order for vessel operations. This will be matched with purchase orders and trigger inspection and bunkering operations.
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Basic Information */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="SO Number"
                  value={formData.soNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, soNumber: e.target.value }))}
                  placeholder="e.g., SO-2024-001"
                  error={!!errors.soNumber}
                  helperText={errors.soNumber || 'Unique shipping order number'}
                  fullWidth
                  variant="outlined"
                  size="medium"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Purchase Order ID"
                  value={formData.purchaseOrderId}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchaseOrderId: e.target.value }))}
                  placeholder="e.g., PO-2024-001"
                  error={!!errors.purchaseOrderId}
                  helperText={errors.purchaseOrderId || 'Reference to existing purchase order'}
                  fullWidth
                  variant="outlined"
                  size="medium"
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Vessel Number"
                  value={formData.vesselNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, vesselNumber: e.target.value }))}
                  placeholder="e.g., VSL-001"
                  error={!!errors.vesselNumber}
                  helperText={errors.vesselNumber || 'Unique vessel identifier'}
                  fullWidth
                  variant="outlined"
                  size="medium"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Customer Number"
                  value={formData.customerNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerNumber: e.target.value }))}
                  placeholder="e.g., CUST-001"
                  error={!!errors.customerNumber}
                  helperText={errors.customerNumber || 'Customer number'}
                  fullWidth
                  variant="outlined"
                  size="medium"
                />
          
              </Grid>
            </Grid>
            
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Estimated Arrival"
                  type="datetime-local"
                  value={formData.estimatedArrival.toISOString().slice(0, 16)}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    estimatedArrival: new Date(e.target.value) 
                  }))}
                  fullWidth
                  variant="outlined"
                  size="medium"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Estimated Departure"
                  type="datetime-local"
                  value={formData.estimatedDeparture.toISOString().slice(0, 16)}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    estimatedDeparture: new Date(e.target.value) 
                  }))}
                  error={!!errors.estimatedDeparture}
                  helperText={errors.estimatedDeparture?.toString() || 'Estimated departure time'}
                  fullWidth
                  variant="outlined"
                  size="medium"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Actual Arrival"
                  type="datetime-local"
                  value={formData.actualArrival.toISOString().slice(0, 16)}
                  onChange={(e) => setFormData(prev => ({ ...prev, actualArrival: new Date(e.target.value) }))}
                  fullWidth
                  error={!!errors.actualArrival}
                  helperText={errors.actualArrival?.toString() || 'Actual arrival time'}
                  variant="outlined"
                  size="medium"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            
            {/* Info Alert */}
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Note:</strong> Upon creation, this shipping order will automatically trigger:
                <br />• Inspection Operation (IO) planning - Safety inspection by port authorities
                <br />• Bunkering Operation (BO) planning - Vessel refueling
                <br />• Loading operation will begin after IO and BO are completed
                <br />• The vessel will be marked as departed automatically after bunkering (includes inspection) is completed and vessel is marked READY_TO_LOAD
                <br />• The shipping order will be marked as completed when the loading operation is completed
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            disabled={createShippingOrderMutation.isPending}
            sx={{ 
              borderColor: 'divider',
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={createShippingOrderMutation.isPending}
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
            {createShippingOrderMutation.isPending ? 'Creating...' : 'Create Shipping Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
