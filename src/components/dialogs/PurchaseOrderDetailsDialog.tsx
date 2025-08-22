import React from 'react';
import {
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import {Close as CloseIcon, TrendingUp as TrendingUpIcon} from '@mui/icons-material';
import {Package, User} from 'lucide-react';

interface PurchaseOrderDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    purchaseOrder: any;
}

export function PurchaseOrderDetailsDialog({open, onClose, purchaseOrder}: PurchaseOrderDetailsDialogProps) {
    if (!purchaseOrder) return null;

    const totalValue = purchaseOrder.items?.reduce((sum: number, item: any) => sum + (item.totalPrice || 0), 0) || 0;
    const totalQuantity = purchaseOrder.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0;
    const commissionFee = totalValue * 0.01;

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
            case 'confirmed':
                return 'info';
            case 'fulfilled':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
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
                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <Avatar sx={{bgcolor: 'primary.main'}}>
                        <Package/>
                    </Avatar>
                    <Box>
                        <Typography variant="h6" component="span">
                            Purchase Order {purchaseOrder.poNumber || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{display: 'block'}}>
                            {purchaseOrder.customerName || 'Customer Name'}
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{pt: 2}}>
                <Grid container spacing={3}>
                    {/* Basic Info */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{p: 3, height: 'fit-content'}}>
                            <Typography variant="h6" gutterBottom sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <User/>
                                Order Information
                            </Typography>

                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">PO Number</Typography>
                                    <Typography variant="body1"
                                                fontWeight={600}>{purchaseOrder.poNumber || 'N/A'}</Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.secondary">Customer ID</Typography>
                                    <Typography variant="body1"
                                                fontWeight={600}>{purchaseOrder.customerId || 'N/A'}</Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.secondary">Customer Name</Typography>
                                    <Typography variant="body1"
                                                fontWeight={600}>{purchaseOrder.customerName || 'N/A'}</Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.secondary">Order Date</Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {formatDate(purchaseOrder.orderDate)}
                                    </Typography>
                                </Box>

                                {purchaseOrder.estimatedDeliveryDate && (
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">Estimated
                                            Delivery</Typography>
                                        <Typography variant="body1" fontWeight={600}>
                                            {formatDate(purchaseOrder.estimatedDeliveryDate)}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Summary & Status */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{p: 3, height: 'fit-content'}}>
                            <Typography variant="h6" gutterBottom sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <TrendingUpIcon/>
                                Order Summary
                            </Typography>

                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                                <Box>
                                    <Typography variant="body2" color="text.primary" gutterBottom>Status</Typography>
                                    <Chip
                                        label={purchaseOrder.status || 'Pending'}
                                        color={getStatusColor(purchaseOrder.status) as any}
                                        size="medium"
                                        sx={{fontWeight: 600}}
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.primary" gutterBottom>Total
                                        Items</Typography>
                                    <Typography variant="h4" fontWeight={700} color="primary.main">
                                        {purchaseOrder.items?.length || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">order items</Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.primary" gutterBottom>Total
                                        Quantity</Typography>
                                    <Typography variant="h4" fontWeight={700} color="success.main">
                                        {totalQuantity.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">tons</Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.primary" gutterBottom>Total
                                        Value</Typography>
                                    <Typography variant="h4" fontWeight={700} color="warning.main">
                                        ${totalValue.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">total order value</Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.primary" gutterBottom>Expected Commission
                                        Fee (1%)</Typography>
                                    <Typography variant="h4" fontWeight={700} color="info.main">
                                        ${commissionFee.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">1% of total value</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Order Items */}
                    <Grid item xs={12}>
                        <Paper sx={{p: 3}}>
                            <Typography variant="h6" gutterBottom sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <Package/>
                                Order Items ({purchaseOrder.items?.length || 0})
                            </Typography>

                            {purchaseOrder.items && purchaseOrder.items.length > 0 ? (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Material</TableCell>
                                                <TableCell align="right">Quantity (tons)</TableCell>
                                                <TableCell align="right">Price per Ton</TableCell>
                                                <TableCell align="right">Total Price</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {purchaseOrder.items.map((item: any, index: number) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                            <Package/>
                                                            <Typography variant="body1" fontWeight={600}>
                                                                {item.material}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body1" fontWeight={600}>
                                                            {item.quantity?.toLocaleString() || '0'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body1" color="text.secondary">
                                                            ${item.agreedPricePerTon?.toLocaleString() || '0'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body1" fontWeight={600}
                                                                    color="primary.main">
                                                            ${item.totalPrice?.toLocaleString() || '0'}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Box sx={{textAlign: 'center', py: 4}}>
                                    <Package/>
                                    <Typography variant="body1" color="text.secondary" sx={{mt: 2}}>
                                        No items in this order
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{p: 3, pt: 1}}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderColor: 'divider',
                        color: 'text.secondary',
                        '&:hover': {
                            borderColor: 'primary.main',
                            color: 'primary.main'
                        }
                    }}
                >
                    Close
                </Button>
                <Button
                    variant="contained"
                    startIcon={<TrendingUpIcon/>}
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
                    Track Order
                </Button>
            </DialogActions>
        </Dialog>
    );
}
