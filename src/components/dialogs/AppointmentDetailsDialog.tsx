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
    Typography
} from '@mui/material';
import {Close as CloseIcon, TrendingUp as TrendingUpIcon} from '@mui/icons-material';
import {Calendar, Truck, User} from 'lucide-react';

interface AppointmentDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    appointment: any;
}

export function AppointmentDetailsDialog({open, onClose, appointment}: AppointmentDetailsDialogProps) {
    if (!appointment) return null;

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
            case 'scheduled':
                return 'info';
            case 'arrived':
                return 'success';
            case 'in_progress':
                return 'warning';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getArrivalWindow = (scheduledTime: Date) => {
        const start = new Date(scheduledTime);
        const end = new Date(scheduledTime.getTime() + 60 * 60 * 1000); // +1 hour

        return {
            start: start.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
            end: end.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
        };
    };

    const arrivalWindow = getArrivalWindow(appointment.scheduledTime);

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
                        <Calendar/>
                    </Avatar>
                    <Box>
                        <Typography variant="h6" component="span">
                            Appointment Full Details
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{display: 'block'}}>
                            Truck License Plate: {appointment.licensePlate || 'N/A'}
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{pt: 2}}>
                <Grid container spacing={3}>
                    {/* Left Column - Basic Info */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{p: 3, height: 'fit-content'}}>
                            <Typography variant="h6" gutterBottom sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <User/>
                                Appointment Information
                            </Typography>

                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Appointment ID</Typography>
                                    <Typography variant="body1"
                                                fontWeight={600}>{appointment.id || 'N/A'}</Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.secondary">Seller ID</Typography>
                                    <Typography variant="body1"
                                                fontWeight={600}>{appointment.sellerId || 'N/A'}</Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.secondary">Seller Name</Typography>
                                    <Typography variant="body1"
                                                fontWeight={600}>{appointment.sellerName || 'N/A'}</Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.secondary">Raw Material</Typography>
                                    <Chip
                                        label={appointment.material || 'N/A'}
                                        color="primary"
                                        size="small"
                                        sx={{fontWeight: 600}}
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.secondary">Truck Type</Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {appointment.truckType || 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right Column - Schedule & Status */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{p: 3, height: 'fit-content'}}>
                            <Typography variant="h6" gutterBottom sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <Calendar/>
                                Schedule & Status
                            </Typography>

                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>Status</Typography>
                                    <Chip
                                        label={appointment.status || 'Scheduled'}
                                        color={getStatusColor(appointment.status) as any}
                                        size="medium"
                                        sx={{fontWeight: 600}}
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>Scheduled
                                        Time</Typography>
                                    <Typography variant="h6" fontWeight={600} color="primary.main">
                                        {formatDate(appointment.scheduledTime)}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>Arrival
                                        Window</Typography>
                                    <Typography variant="body1" fontWeight={600} color="success.main">
                                        {arrivalWindow.start} - {arrivalWindow.end}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        1-hour arrival window
                                    </Typography>
                                </Box>

                                {appointment.actualArrivalTime && (
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>Actual
                                            Arrival</Typography>
                                        <Typography variant="body1" fontWeight={600} color="info.main">
                                            {formatDate(appointment.actualArrivalTime)}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Full Width - Truck & Material Details */}
                    <Grid item xs={12}>
                        <Paper sx={{p: 3}}>
                            <Typography variant="h6" gutterBottom sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <Truck/>
                                Truck & Material Details
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2}}>
                                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                            Truck Information
                                        </Typography>
                                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">License
                                                    Plate</Typography>
                                                <Typography variant="body1"
                                                            fontWeight={600}>{appointment.licensePlate || 'N/A'}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">Truck
                                                    Type</Typography>
                                                <Typography variant="body1"
                                                            fontWeight={600}>{appointment.truckType || 'N/A'}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">Capacity</Typography>
                                                <Typography variant="body1" fontWeight={600}>
                                                    {appointment.truckType === 'LARGE' ? '25 tons' :
                                                        appointment.truckType === 'MEDIUM' ? '15 tons' : '0.25 tons'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box sx={{p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2}}>
                                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                            Material Information
                                        </Typography>
                                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">Material
                                                    Type</Typography>
                                                <Typography variant="body1"
                                                            fontWeight={600}>{appointment.material || 'N/A'}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">Storage
                                                    Cost</Typography>
                                                <Typography variant="body1" fontWeight={600}>
                                                    ${appointment.material === 'Gypsum' ? '1' :
                                                    appointment.material === 'Iron Ore' ? '5' :
                                                        appointment.material === 'Cement' ? '3' :
                                                            appointment.material === 'Petcoke' ? '10' :
                                                                appointment.material === 'Slag' ? '7' : 'N/A'}/ton/day
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{p: 3, pt: 1}}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    startIcon={<CloseIcon/>}
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
