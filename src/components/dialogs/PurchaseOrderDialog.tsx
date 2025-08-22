import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
  Box,
  Divider,
  Alert,
  LinearProgress,
  MenuItem
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import { useCreatePurchaseOrder } from '@/hooks/usePurchaseOrderData';
import { CreatePurchaseOrderRequest, CreateOrderLineRequest } from '@/types';

interface PurchaseOrderDialogProps {
  children: React.ReactNode;
}

export function PurchaseOrderDialog({ children }: PurchaseOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreatePurchaseOrderRequest>({
    purchaseOrderNumber: '',
    customerNumber: '',
    customerName: '',
    sellerId: '', 
    sellerName: '', 
    orderDate: new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', ''),
    orderLines: []
  });

  const createPurchaseOrder = useCreatePurchaseOrder();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      purchaseOrderNumber: '',
      customerNumber: '',
      customerName: '',
      sellerId: '',
      sellerName: '',
      orderDate: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(',', ''),
      orderLines: []
    });
  };

  const addOrderLine = () => {
    const newLine: CreateOrderLineRequest = {
      lineNumber: formData.orderLines.length + 1,
      rawMaterialName: 'Gypsum',
      amountInTons: 0,
      pricePerTon: 0
    };
    setFormData(prev => ({
      ...prev,
      orderLines: [...prev.orderLines, newLine]
    }));
  };

  const removeOrderLine = (index: number) => {
    setFormData(prev => ({
      ...prev,
      orderLines: prev.orderLines
        .filter((_, i) => i !== index)
        .map((line, i) => ({ ...line, lineNumber: i + 1 }))
    }));
  };

  const updateOrderLine = (index: number, field: keyof CreateOrderLineRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      orderLines: prev.orderLines.map((line, i) => 
        i === index ? { ...line, [field]: value } : line
      )
    }));
  };

  const handleSubmit = async () => {
    try {
      await createPurchaseOrder.mutateAsync(formData);
      handleClose();
    } catch (error) {
      console.error('Failed to create purchase order:', error);
    }
  };

  const calculateTotalValue = () => {
    return formData.orderLines.reduce((total, line) => {
      return total + (line.amountInTons * line.pricePerTon);
    }, 0);
  };

  const calculateCommissionFee = () => {
    return formData.orderLines.reduce((total, line) => {
      return total + (line.amountInTons * line.pricePerTon);
    }, 0) * 0.01;
  };

  const isFormValid = () => {
    return (
      formData.purchaseOrderNumber.trim() !== '' &&
      formData.customerNumber.trim() !== '' &&
      formData.customerName.trim() !== '' &&
      formData.sellerId.trim() !== '' &&
      formData.sellerName.trim() !== '' &&
      formData.orderLines.length > 0 &&
      formData.orderLines.every(line => 
        line.amountInTons > 0 && line.pricePerTon > 0
      )
    );
  };

  return (
    <>
      <div onClick={handleOpen}>
        {children}
      </div>
      
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Create New Purchase Order</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {createPurchaseOrder.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to create purchase order: {createPurchaseOrder.error?.message}
            </Alert>
          )}
          
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Basic Information</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="PO Number"
                value={formData.purchaseOrderNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, purchaseOrderNumber: e.target.value }))}
                placeholder="Purchase order number"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Order Date"
                value={formData.orderDate}
                onChange={(e) => setFormData(prev => ({ ...prev, orderDate: e.target.value }))}
                placeholder="01/09/2025 08:00"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Number"
                value={formData.customerNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, customerNumber: e.target.value }))}
                placeholder="Customer number"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Name of the customer"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Seller ID"
                value={formData.sellerId}
                onChange={(e) => setFormData(prev => ({ ...prev, sellerId: e.target.value }))}
                placeholder="ID of the seller"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Seller Name"
                value={formData.sellerName}
                onChange={(e) => setFormData(prev => ({ ...prev, sellerName: e.target.value }))}
                placeholder="Name of the seller"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Order Lines</Typography>
              
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addOrderLine}
                sx={{ mb: 2 }}
              >
                Add Order Line
              </Button>
              
              {formData.orderLines.map((line, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle2">Line {line.lineNumber}</Typography>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => removeOrderLine(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Material"
                        select
                        value={line.rawMaterialName}
                        onChange={(e) => updateOrderLine(index, 'rawMaterialName', e.target.value)}
                        required
                      >
                        <MenuItem value="Gypsum">Gypsum</MenuItem>
                        <MenuItem value="Iron_Ore">Iron Ore</MenuItem>
                        <MenuItem value="Cement">Cement</MenuItem>
                        <MenuItem value="PetCoke">PetCoke</MenuItem>
                        <MenuItem value="Slag">Slag</MenuItem>
                      </TextField>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Amount (tons)"
                        type="number"
                        value={line.amountInTons}
                        onChange={(e) => updateOrderLine(index, 'amountInTons', parseFloat(e.target.value) || 0)}
                        inputProps={{ min: 0, step: 0.1 }}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Price per ton"
                        type="number"
                        value={line.pricePerTon}
                        onChange={(e) => updateOrderLine(index, 'pricePerTon', parseFloat(e.target.value) || 0)}
                        inputProps={{ min: 0, step: 0.01 }}
                        required
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 1, textAlign: 'right' }}>
                    <Typography variant="body2" color="text.secondary">
                      Line Total: ${(line.amountInTons * line.pricePerTon).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              ))}
              
              {formData.orderLines.length > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                  <Typography variant="h6" color="primary.contrastText">
                    Total Order Value: ${calculateTotalValue().toFixed(2)}
                  </Typography>
                </Box>
              )}

              {formData.orderLines.length > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'secondary.light', borderRadius: 1 }}>
                  <Typography variant="h6" color="secondary.contrastText">
                    Expected Commission Fee: ${calculateCommissionFee().toFixed(2)}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!isFormValid() || createPurchaseOrder.isPending}
            startIcon={createPurchaseOrder.isPending ? <LinearProgress /> : undefined}
          >
            {createPurchaseOrder.isPending ? 'Creating...' : 'Create Purchase Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
