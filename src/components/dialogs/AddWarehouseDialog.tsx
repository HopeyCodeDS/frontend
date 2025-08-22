import React, {useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import {Warehouse as WarehouseIcon} from 'lucide-react';
import {useCreateWarehouse} from '@/hooks/useWarehouseData';
import {useToast} from '@/hooks/use-toast';

interface AddWarehouseDialogProps {
    children: React.ReactNode;
    onWarehouseAdded?: () => void;
}

interface WarehouseFormData {
    number: string;
    sellerId: string;
    sellerName: string;
    material: string;
    maxCapacity: number;
}

const MATERIALS = [
    {value: 'gypsum', label: 'Gypsum', price: 13, storageCost: 1},
    {value: 'iron-ore', label: 'Iron Ore', price: 110, storageCost: 5},
    {value: 'cement', label: 'Cement', price: 95, storageCost: 3},
    {value: 'petcoke', label: 'Petcoke', price: 210, storageCost: 10},
    {value: 'slag', label: 'Slag', price: 160, storageCost: 7}
];

export function AddWarehouseDialog({children, onWarehouseAdded}: AddWarehouseDialogProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<WarehouseFormData>({
        number: '',
        sellerId: '',
        sellerName: '',
        material: '',
        maxCapacity: 500000
    });
    const [errors, setErrors] = useState<Partial<WarehouseFormData>>({});

    const {toast} = useToast();
    const createWarehouseMutation = useCreateWarehouse();

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setFormData({
            number: '',
            sellerId: '',
            sellerName: '',
            material: '',
            maxCapacity: 500000
        });
        setErrors({});
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<WarehouseFormData> = {};

        if (!formData.number.trim()) {
            newErrors.number = 'Warehouse number is required';
        }
        if (!formData.sellerId.trim()) {
            newErrors.sellerId = 'Seller ID is required';
        }
        if (!formData.sellerName.trim()) {
            newErrors.sellerName = 'Seller name is required';
        }
        if (!formData.material) {
            newErrors.material = 'Material type is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            await createWarehouseMutation.mutateAsync({
                number: formData.number,
                sellerId: formData.sellerId,
                sellerName: formData.sellerName,
                material: formData.material as any,
                maxCapacity: formData.maxCapacity,
                currentStock: 0,
                payloads: []
            });

            toast({
                title: "Success",
                description: `Warehouse ${formData.number} created successfully`,
                variant: "default"
            });

            if (onWarehouseAdded) {
                onWarehouseAdded();
            }

            handleClose();
        } catch (error) {
            console.error('Failed to create warehouse:', error);
            toast({
                title: "Error",
                description: "Failed to create warehouse. Please try again.",
                variant: "destructive"
            });
        }
    };

    const isSubmitting = createWarehouseMutation.isPending;

    return (
        <>
            <Box onClick={handleOpen}>
                {children}
            </Box>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <WarehouseIcon size={24}/>
                    Add New Warehouse
                </DialogTitle>

                <DialogContent>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 1}}>
                        <TextField
                            label="Warehouse Number"
                            value={formData.number}
                            onChange={(e) => setFormData({...formData, number: e.target.value})}
                            error={!!errors.number}
                            helperText={errors.number}
                            fullWidth
                            required
                        />

                        <TextField
                            label="Seller ID"
                            value={formData.sellerId}
                            onChange={(e) => setFormData({...formData, sellerId: e.target.value})}
                            error={!!errors.sellerId}
                            helperText={errors.sellerId}
                            fullWidth
                            required
                        />

                        <TextField
                            label="Seller Name"
                            value={formData.sellerName}
                            onChange={(e) => setFormData({...formData, sellerName: e.target.value})}
                            error={!!errors.sellerName}
                            helperText={errors.sellerName}
                            fullWidth
                            required
                        />

                        <FormControl fullWidth required error={!!errors.material}>
                            <InputLabel>Material Type</InputLabel>
                            <Select
                                value={formData.material}
                                onChange={(e) => setFormData({...formData, material: e.target.value})}
                                label="Material Type"
                            >
                                {MATERIALS.map((material) => (
                                    <MenuItem key={material.value} value={material.value}>
                                        {material.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.material && (
                                <Typography variant="caption" color="error" sx={{mt: 0.5}}>
                                    {errors.material}
                                </Typography>
                            )}
                        </FormControl>

                        <TextField
                            label="Maximum Capacity (tons)"
                            type="number"
                            value={formData.maxCapacity}
                            onChange={(e) => setFormData({...formData, maxCapacity: Number(e.target.value)})}
                            error={!!errors.maxCapacity}
                            helperText={errors.maxCapacity}
                            fullWidth
                            required
                            inputProps={{min: 1}}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{p: 2}}>
                    <Button onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={16}/> : <WarehouseIcon/>}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Warehouse'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
