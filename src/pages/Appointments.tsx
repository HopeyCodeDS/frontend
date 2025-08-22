import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  LinearProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Apartment,
  Delete as DeleteIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Calendar, CheckCircle, Clock, Package, Truck, X } from 'lucide-react';
import { Appointment } from '@/types';
import { ScheduleAppointmentDialog } from '@/components/dialogs/ScheduleAppointmentDialog';
import { AppointmentDetailsDialog } from '@/components/dialogs/AppointmentDetailsDialog';
import { 
  useAppointments, 
  useAppointmentOverview, 
  useDeleteAppointment 
} from '@/hooks/useAppointmentsData';
import { useToast } from '@/hooks/use-toast';

// Tab Panel Component
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{p: 3}}>{children}</Box>}
        </div>
    );
}

// Appointment Card Component
const AppointmentCard = ({appointment, onViewDetails, onDelete, appointmentNumber}: {
    appointment: Appointment;
    onViewDetails: (appointment: Appointment) => void;
    onDelete: () => void;
    appointmentNumber: number;
}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'departed':
                return 'success';
            case 'arrived':
                return 'warning';
            case 'scheduled':
                return 'info';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'departed':
                return <CheckCircle/>;
            case 'arrived':
                return <TrendingUpIcon/>;
            case 'scheduled':
                return <Clock/>;
            case 'cancelled':
                return <X/>;
            default:
                return <Calendar/>;
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
        <Card elevation={2} sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <CardHeader
                avatar={
                    <Avatar sx={{bgcolor: 'primary.main'}}>
                        <Calendar/>
                    </Avatar>
                }
                title={`Appointment ${appointmentNumber}`}
                subheader={`ID: ${appointment.id}`}
                action={
                    <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status) as any}
                        size="small"
                        icon={getStatusIcon(appointment.status)}
                    />
                }
                titleTypographyProps={{variant: 'h6'}}
                subheaderTypographyProps={{variant: 'body2'}}
            />
            <CardContent sx={{flexGrow: 1}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <Truck />
                    <Typography className='font-medium' fontSize={15} color="text.secondary" gutterBottom>
                        License Plate: {appointment.licensePlate}
                    </Typography>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <Apartment />
                    <Typography className='font-medium' fontSize={15} color="text.secondary" gutterBottom>
                        Seller: {appointment.sellerName}
                    </Typography>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <Package />
                    <Typography className='font-medium' fontSize={15} color="text.secondary" gutterBottom>
                        Material: {appointment.material}
                    </Typography>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <Calendar />
                    <Typography className='font-medium' fontSize={15} color="text.secondary" gutterBottom>
                        Scheduled: {appointment.scheduledTime.toLocaleDateString()}
                    </Typography>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <Clock />
                    <Typography className='font-medium' fontSize={15} color="text.secondary" gutterBottom>
                        Time: {appointment.scheduledTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </Typography>
                </Box>
            </CardContent>
            <Box sx={{p: 2, pt: 0, display: 'flex', gap: 1, mt: 1, width: '100%', justifyContent: 'space-between'}}>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ViewIcon/>}
                    onClick={() => onViewDetails(appointment)}
                    sx={{mb: 1, width: '100%', flex: 1}}
                >
                    View Details
                </Button>
                <IconButton size="small" color="primary">
                    <EditIcon/>
                </IconButton>
                <IconButton 
                    size="small" 
                    color="error"
                    onClick={onDelete}
                >
                    <DeleteIcon/>
                </IconButton>
            </Box>
        </Card>
    );
};

export default function Appointments() {
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  // State variables for the dialog
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Using React Query to fetch appointment data
  const { 
    data: appointments = [], 
    isLoading, 
    error, 
    refetch 
  } = useAppointments();

  // Get appointment overview
  const { 
    data: overview = { total: 0, scheduled: 0, inProgress: 0, departed: 0, cancelled: 0 },
    isLoading: overviewLoading 
  } = useAppointmentOverview();

  // Delete appointment mutation
  const deleteAppointmentMutation = useDeleteAppointment();

  // Handler functions
  const handleViewDetails = (appointment: Appointment) => {
    console.log('View Details clicked for appointment:', appointment);
    setSelectedAppointment(appointment);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      await deleteAppointmentMutation.mutateAsync(appointmentId);
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive",
      });
    }
  };

  // Filter appointments by status
  const scheduledAppointments = appointments.filter(apt => apt.status === 'scheduled');
  const inProgressAppointments = appointments.filter(apt => apt.status !== 'scheduled' && apt.status !== 'cancelled' && apt.status !== 'departed');
  const completedAppointments = appointments.filter(apt => apt.status === 'departed');
  const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled');

  // Show loading state
  if (isLoading && appointments.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
              Appointments
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Loading appointments...
            </Typography>
          </Box>
        </Box>
        <LinearProgress sx={{ mb: 2 }} />
        <Card elevation={2}>
          <CardContent>
            <Typography>Loading appointments data...</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Show error state
  if (error && appointments.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
              Appointments
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Error loading appointments
            </Typography>
          </Box>
        </Box>
        <Card elevation={2}>
          <CardContent>
            <Alert severity="error" sx={{ mb: 2 }}>
              Error: {error.message}
            </Alert>
            <Button variant="contained" onClick={handleRefresh}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with refresh button and last updated info */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
            Appointments
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track truck appointments for material handling
          </Typography>
          {/* Data Source Indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Typography variant="caption" color="info.main">
              Data source: {Array.isArray(appointments) && appointments.length > 0 ? 'Backend' : 'Mock Data'}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleRefresh}
            disabled={isLoading}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
          <ScheduleAppointmentDialog>
            <Button variant="contained" startIcon={<Calendar />} size="large">
              Schedule Appointment
            </Button>
          </ScheduleAppointmentDialog>
        </Box>
      </Box>

      {/* Show loading indicator if refreshing */}
      {isLoading && appointments.length > 0 && (
        <LinearProgress sx={{ mb: 2 }} />
      )}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardHeader
              title="Total Appointments"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {overview.total}
              </Typography>
              <Typography className='font-medium' color="text.secondary">
                appointments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardHeader
              title="Scheduled"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h3" component="div"
                sx={{ fontWeight: 'bold', mb: 1, color: 'info.main' }}>
                {overview.scheduled}
              </Typography>
              <Typography className='font-medium' color="text.secondary">
                scheduled, awaiting for truck to arrive
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardHeader
              title="In Progress"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h3" component="div"
                sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                {overview.inProgress}
              </Typography>
              <Typography className='font-medium' color="text.secondary">
                operation ongoing
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardHeader
              title="Cancelled"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h3" component="div"
                sx={{ fontWeight: 'bold', mb: 1, color: 'error.main' }}>
                {overview.cancelled}
              </Typography>
              <Typography className='font-medium' color="text.secondary">
                cancelled due to some reasons
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs and Content */}
      <Card sx={{ mb: 2 }}>
        <Box sx={{
          display: 'flex',
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}>
          {[
            { label: 'Scheduled', count: overview.scheduled },
            { label: 'In Progress', count: overview.inProgress },
            { label: 'Departed', count: overview.departed },
            { label: 'Cancelled', count: overview.cancelled }
          ].map((tab, index) => (
            <Box
              key={tab.label}
              onClick={() => setTabValue(index)}
              sx={{
                flex: 1,
                py: 2,
                px: 3,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: tabValue === index ? 'action.selected' : 'transparent',
                color: tabValue === index ? 'text.primary' : 'text.secondary',
                borderBottom: tabValue === index ? 2 : 'none',
                borderColor: 'primary.main',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: tabValue === index ? 600 : 400,
                  fontSize: '1.1rem'
                }}
              >
                {tab.label} ({tab.count})
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>

      <CardContent sx={{ px: 0, mx: -3 }}>
        <TabPanel value={tabValue} index={0}>
          {viewMode === 'cards' ? (
            <Grid container spacing={3}>
              {scheduledAppointments.map((appointment, index) => (
                <Grid item xs={12} sm={6} lg={4} key={appointment.id}>
                  <AppointmentCard
                    appointment={appointment as Appointment}
                    onViewDetails={handleViewDetails}
                    onDelete={() => handleDeleteAppointment(appointment.id)}
                    appointmentNumber={index + 1}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Appointment ID</TableCell>
                    <TableCell>License Plate</TableCell>
                    <TableCell>Seller</TableCell>
                    <TableCell>Material</TableCell>
                    <TableCell>Scheduled Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scheduledAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.id}</TableCell>
                      <TableCell>{appointment.licensePlate}</TableCell>
                      <TableCell>{appointment.sellerName}</TableCell>
                      <TableCell>{appointment.material}</TableCell>
                      <TableCell>{appointment.scheduledTime.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip label={appointment.status} color="info" size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewDetails(appointment as Appointment)}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton size="small" color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteAppointment(appointment.id)}
                            disabled={deleteAppointmentMutation.isPending}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {viewMode === 'cards' ? (
            <Grid container spacing={3}>
              {inProgressAppointments.map((appointment, index) => (
                <Grid item xs={12} sm={6} lg={4} key={appointment.id}>
                  <AppointmentCard
                    appointment={appointment as Appointment}
                    onViewDetails={handleViewDetails}
                    onDelete={() => handleDeleteAppointment(appointment.id)}
                    appointmentNumber={index + 1}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Appointment ID</TableCell>
                    <TableCell>License Plate</TableCell>
                    <TableCell>Seller</TableCell>
                    <TableCell>Material</TableCell>
                    <TableCell>Scheduled Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inProgressAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.id}</TableCell>
                      <TableCell>{appointment.licensePlate}</TableCell>
                      <TableCell>{appointment.sellerName}</TableCell>
                      <TableCell>{appointment.material}</TableCell>
                      <TableCell>{appointment.scheduledTime.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip label={appointment.status} color="warning" size="small"/>
                      </TableCell>
                      <TableCell>
                        <Box sx={{display: 'flex', gap: 0.5}}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewDetails(appointment as Appointment)}
                          >
                            <ViewIcon/>
                          </IconButton>
                          <IconButton size="small" color="primary">
                            <EditIcon/>
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {viewMode === 'cards' ? (
            <Grid container spacing={3}>
              {completedAppointments.map((appointment, index) => (
                <Grid item xs={12} sm={6} lg={4} key={appointment.id}>
                  <AppointmentCard
                    appointment={appointment as Appointment}
                    onViewDetails={handleViewDetails}
                    onDelete={() => handleDeleteAppointment(appointment.id)}
                    appointmentNumber={index + 1}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Appointment ID</TableCell>
                    <TableCell>License Plate</TableCell>
                    <TableCell>Seller</TableCell>
                    <TableCell>Material</TableCell>
                    <TableCell>Scheduled Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {completedAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.id}</TableCell>
                      <TableCell>{appointment.licensePlate}</TableCell>
                      <TableCell>{appointment.sellerName}</TableCell>
                      <TableCell>{appointment.material}</TableCell>
                      <TableCell>{appointment.scheduledTime.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip label={appointment.status} color="success" size="small"/>
                      </TableCell>
                      <TableCell>
                        <Box sx={{display: 'flex', gap: 0.5}}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewDetails(appointment as Appointment)}
                          >
                            <ViewIcon/>
                          </IconButton>
                          <IconButton size="small" color="primary">
                            <EditIcon/>
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {viewMode === 'cards' ? (
            <Grid container spacing={3}>
              {cancelledAppointments.map((appointment, index) => (
                <Grid item xs={12} sm={6} lg={4} key={appointment.id}>
                  <AppointmentCard
                    appointment={appointment as Appointment}
                    onViewDetails={handleViewDetails}
                    onDelete={() => handleDeleteAppointment(appointment.id)}
                    appointmentNumber={index + 1}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Appointment ID</TableCell>
                    <TableCell>License Plate</TableCell>
                    <TableCell>Seller</TableCell>
                    <TableCell>Material</TableCell>
                    <TableCell>Scheduled Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cancelledAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.id}</TableCell>
                      <TableCell>{appointment.licensePlate}</TableCell>
                      <TableCell>{appointment.sellerName}</TableCell>
                      <TableCell>{appointment.material}</TableCell>
                      <TableCell>{appointment.scheduledTime.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip label={appointment.status} color="error" size="small"/>
                      </TableCell>
                      <TableCell>
                        <Box sx={{display: 'flex', gap: 0.5}}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewDetails(appointment as Appointment)}
                          >
                            <ViewIcon/>
                          </IconButton>
                          <IconButton size="small" color="primary">
                            <EditIcon/>
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      </CardContent>

      {/* Appointment Details Dialog */}
      <AppointmentDetailsDialog
        open={isDetailsDialogOpen}
        onClose={handleCloseDetails}
        appointment={selectedAppointment}
      />

      {/* Success/Error Snackbar */}
      <Snackbar
        open={!!deleteAppointmentMutation.isSuccess || !!deleteAppointmentMutation.isError}
        autoHideDuration={6000}
        onClose={() => deleteAppointmentMutation.reset()}
      >
        <Alert
          onClose={() => deleteAppointmentMutation.reset()}
          severity={deleteAppointmentMutation.isSuccess ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {deleteAppointmentMutation.isSuccess 
            ? 'Appointment deleted successfully' 
            : deleteAppointmentMutation.error?.message || 'Failed to delete appointment'
          }
        </Alert>
      </Snackbar>
    </Box>
  );
}