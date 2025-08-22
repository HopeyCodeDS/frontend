import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  Grid,
  InputAdornment,
  Snackbar
} from '@mui/material';
import { Calendar, Truck, Package, Clock } from 'lucide-react';
import { useCreateAppointment } from '@/hooks/useAppointmentsData';
import { useToast } from '@/hooks/use-toast';

interface ScheduleAppointmentDialogProps {
  children: React.ReactNode;
}

interface AppointmentFormData {
  sellerId: string;
  sellerName: string;
  licensePlate: string;
  truckType: 'SMALL' | 'MEDIUM' | 'LARGE';
  rawMaterialName: string;
  scheduledDate: string;
  scheduledTime: string;
}

// Match your backend TruckType enum
const TRUCK_TYPES = [
  { value: 'SMALL', label: 'Small (0.25T)', capacity: '0.25 tons' },
  { value: 'MEDIUM', label: 'Medium (15T)', capacity: '15 tons' },
  { value: 'LARGE', label: 'Large (25T)', capacity: '25 tons' }
];

// Match your backend raw materials
const RAW_MATERIALS = [
  { value: 'gypsum', label: 'Gypsum', price: 13, storageCost: 1 },
  { value: 'iron_ore', label: 'Iron Ore', price: 110, storageCost: 5 },
  { value: 'cement', label: 'Cement', price: 95, storageCost: 3 },
  { value: 'petcoke', label: 'Petcoke', price: 210, storageCost: 10 },
  { value: 'slag', label: 'Slag', price: 160, storageCost: 7 }
];

export function ScheduleAppointmentDialog({ children }: ScheduleAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<AppointmentFormData>({
    sellerId: '',
    sellerName: '',
    licensePlate: '',
    truckType: 'LARGE',
    rawMaterialName: '',
    scheduledDate: '',
    scheduledTime: ''
  });
  const [errors, setErrors] = useState<Partial<AppointmentFormData>>({});
  
  // Use React Query mutation hook
  const createAppointmentMutation = useCreateAppointment();
  const { toast } = useToast();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      sellerId: '',
      sellerName: '',
      licensePlate: '',
      truckType: 'LARGE',
      rawMaterialName: '',
      scheduledDate: '',
      scheduledTime: ''
    });
    setErrors({});
    createAppointmentMutation.reset();
  };

  

 


  const getArrivalWindow = (date: string, time: string) => {
    if (!date || !time) {
      return { start: '--:--', end: '--:--' };
    }

    const scheduledDateTime = new Date(date + 'T' + time);
    const start = new Date(scheduledDateTime);
    const end = new Date(scheduledDateTime.getTime() + 60 * 60 * 1000); // +1 hour
    
    return {
      start: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      end: end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const formatDateForBackend = (date: string, time: string): string => {
    // Convert YYYY-MM-DD and HH:MM to dd/MM/yyyy HH:mm format for backend
    const dateObj = new Date(date + 'T' + time);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const arrivalWindow = getArrivalWindow(formData.scheduledDate, formData.scheduledTime);

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {

      const formattedDateTime = formatDateForBackend(formData.scheduledDate, formData.scheduledTime);
      // Format the request to match your backend DTO exactly
      const requestData = {
        sellerId: formData.sellerId,
        sellerName: formData.sellerName, 
        licensePlate: formData.licensePlate,
        truckType: formData.truckType,
        rawMaterialName: formData.rawMaterialName,
        scheduledTime: formattedDateTime
      };

      console.log('Scheduling appointment:', requestData);
      
          // Use React Query mutation to create appointment
      await createAppointmentMutation.mutateAsync(requestData);
      
      // Show success message
      toast({
        title: "Success",
        description: "Appointment scheduled successfully!",
      });
      
      handleClose();
      
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to schedule appointment. Please try again.",
        variant: "destructive",
      });
    }
  };


  const validateForm = (): boolean => {
    const newErrors: Partial<AppointmentFormData> = {};

    if (!formData.sellerId.trim()) {
      newErrors.sellerId = 'Seller ID is required';
    }
    if (!formData.sellerName.trim()) {
      newErrors.sellerName = 'Seller name is required';
    }
    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'License plate is required';
    }
    if (!formData.rawMaterialName) {
      newErrors.rawMaterialName = 'Raw material type is required';
    }
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Date is required';
    }
    if (!formData.scheduledTime) {
      newErrors.scheduledTime = 'Time is required';
    }


    setErrors(newErrors);
    createAppointmentMutation.reset();

    return Object.keys(newErrors).length === 0;
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
          <Calendar size={24} color="#4ade80" />
          <Typography variant="h6" component="span">
            Schedule Truck Appointment
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Schedule a new truck appointment for material handling. Appointments are booked in 1-hour slots with a 1-hour arrival window.
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Seller Information */}
            <TextField
              label="Seller ID"
              value={formData.sellerId}
              onChange={(e) => setFormData(prev => ({ ...prev, sellerId: e.target.value }))}
              placeholder="e.g., ef01c728-ce36-46b5-a110-84f53fdd9668"
              error={!!errors.sellerId}
              helperText={errors.sellerId || 'Unique seller identifier'}
              fullWidth
              variant="outlined"
              size="medium"
            />

            <TextField
              label="Seller Name"
              value={formData.sellerName}
              onChange={(e) => setFormData(prev => ({ ...prev, sellerName: e.target.value }))}
              placeholder="e.g., Energy Minerals Pte Ltd"
              error={!!errors.sellerName}
              helperText={errors.sellerName || 'Seller name'}
              fullWidth
              variant="outlined"
              size="medium"
            />

            {/* Truck Information */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="License Plate"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData(prev => ({ ...prev, licensePlate: e.target.value }))}
                  placeholder="e.g., TRK-001"
                  error={!!errors.licensePlate}
                  helperText={errors.licensePlate || 'Truck license plate number'}
                  fullWidth
                  variant="outlined"
                  size="medium"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Truck Type</InputLabel>
                  <Select
                    value={formData.truckType}
                    label="Truck Type"
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      truckType: e.target.value as 'SMALL' | 'MEDIUM' | 'LARGE'
                    }))}
                    size="medium"
                  >
                    {TRUCK_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label} ({type.capacity})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            {/* Material Selection */}
            <FormControl fullWidth error={!!errors.rawMaterialName}>
              <InputLabel>Raw Material</InputLabel>
              <Select
                value={formData.rawMaterialName}
                label="Raw Material"
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  rawMaterialName: e.target.value
                }))}
                size="medium"
              >
                {RAW_MATERIALS.map((material) => (
                  <MenuItem key={material.value} value={material.value}>
                    {material.label} (${material.price}/ton, ${material.storageCost}/ton/day storage)
                  </MenuItem>
                ))}
              </Select>
              {errors.rawMaterialName && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {errors.rawMaterialName}
                </Typography>
              )}
            </FormControl>
            
            {/* Date and Time Selection */}
            
              
            <TextField
              label="Date"
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                scheduledDate: e.target.value 
              }))}
              error={!!errors.scheduledDate}
              helperText={errors.scheduledDate || 'Select appointment date'}
              fullWidth
              variant="outlined"
              size="medium"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Calendar />
                  </InputAdornment>
                ),
              }}
            />
          
          
          
            <TextField
              label="Time"
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                scheduledTime: e.target.value 
              }))}
              error={!!errors.scheduledTime}
              helperText={errors.scheduledTime || 'Select appointment time'}
              fullWidth
              variant="outlined"
              size="medium"
              InputLabelProps={{ shrink: true }}
              inputProps={{
                step: 3600 // 1 hour steps
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Clock />
                  </InputAdornment>
                ),
              }}
            />
              
            
            
            {/* Arrival Window Display */}
            <Box sx={{ 
              p: 2, 
              bgcolor: 'primary.main', 
              borderRadius: 2,
              color: 'white',
              textAlign: 'center'
            }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Arrival Window
              </Typography>
              <Typography variant="body1">
                {arrivalWindow.start} - {arrivalWindow.end}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Truck must arrive within this 1-hour window
              </Typography>
            </Box>
            
            {/* Info Alert */}
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Important:</strong>
                <br />• Appointments are booked in 1-hour slots
                <br />• Arrival window is exactly 1 hour from scheduled time
                <br />• Maximum 40 trucks per hour can be processed
                <br />• Warehouse will be assigned automatically based on material type and capacity
                <br />• Date format sent to backend: dd/MM/yyyy HH:mm
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            disabled={createAppointmentMutation.isPending}
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
            disabled={createAppointmentMutation.isPending || !formData.rawMaterialName}
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
            {createAppointmentMutation.isPending ? 'Scheduling...' : 'Schedule Appointment'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
