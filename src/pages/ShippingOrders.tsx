import React, { useState } from 'react';
import {
  Box,
  Badge,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Chip,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { CheckCircle, X, AlertTriangle, Calendar, Ship, Package, Anchor } from 'lucide-react';
import { mockData } from '@/lib/mock-data';
import { ShippingOrder, ShippingOrderStatus } from '@/types';
import { ShippingOrderDialog } from '@/components/dialogs/ShippingOrderDialog';
import { ShippingOrderDetailsDialog } from '@/components/dialogs/ShippingOrderDetailsDialog';
import { useShippingOrders } from '@/hooks/useShippingOrderData';

// Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Shipping Order Card Component
const ShippingOrderCard = ({ order, onViewDetails }: { 
  order: ShippingOrder; 
  onViewDetails: (order: ShippingOrder) => void;
}) => {
  const getStatusColor = (status: ShippingOrderStatus) => {
    switch (status) {
      case ShippingOrderStatus.ARRIVED:
        return 'info';
      case ShippingOrderStatus.VALIDATED:
        return 'success';
      case ShippingOrderStatus.BUNKERING:
        return 'secondary';
      case ShippingOrderStatus.READY_FOR_LOADING:
        return 'warning';
      case ShippingOrderStatus.DEPARTED:
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: ShippingOrderStatus) => {
    switch (status) {
      case ShippingOrderStatus.ARRIVED:
        return <CheckCircle />;
      case ShippingOrderStatus.VALIDATED:
        return <CheckCircle />;
      case ShippingOrderStatus.BUNKERING:
        return <TrendingUpIcon />;
      case ShippingOrderStatus.READY_FOR_LOADING:
        return <AlertTriangle />;
      case ShippingOrderStatus.DEPARTED:
        return <Ship />;
      default:
        return <Calendar />;
    }
  };

  return (
    <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <Ship />
          </Avatar>
        }
        title={`SO: ${order.soNumber}`}
        action={
          <Chip 
            label={order.status as ShippingOrderStatus} 
            color={getStatusColor(order.status as ShippingOrderStatus)}
            size="small"
            icon={getStatusIcon(order.status as ShippingOrderStatus)}
          />
        }
        titleTypographyProps={{ variant: 'h6' }}
        subheaderTypographyProps={{ variant: 'body2' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Anchor fontSize="small" />
          <Typography className='font-medium' color="text.secondary" gutterBottom>
            Vessel: {order.vesselNumber}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Package fontSize="small" />
          <Typography className='font-medium' color="text.secondary" gutterBottom>
            PO Reference: {order.poReference}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventIcon fontSize="small" color="action" />
          <Typography className='font-medium' color="text.secondary" gutterBottom>
            Estimated Arrival: {order.estimatedArrivalDate.toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
      <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1, mt: 1, width: '100%', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<ViewIcon />}
          fullWidth
          onClick={() => onViewDetails(order)} // THIS IS THE KEY - ADDING THE CLICK HANDLER
          sx={{ mb: 1, width: '100%', flex: 1 }}
        >
          View Details
        </Button>
        
          <IconButton size="small" color="primary">
            <EditIcon />
          </IconButton>
          <IconButton size="small" color="error">
            <DeleteIcon />
          </IconButton>
      </Box>
    </Card>
  );
};

export default function ShippingOrders() {
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  // Replace mock data with React Query hook
  const { 
    data: shippingOrders = [], 
    isLoading, 
    error, 
    refetch 
  } = useShippingOrders();
  
  const [selectedShippingOrder, setSelectedShippingOrder] = useState<ShippingOrder | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // ADD THESE HANDLER FUNCTIONS
  const handleViewDetails = (order: ShippingOrder) => {
    console.log('View Details clicked for shipping order:', order); // Debug log
    setSelectedShippingOrder(order);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsDialogOpen(false);
    setSelectedShippingOrder(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading shipping orders...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error loading shipping orders
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {error instanceof Error ? error.message : 'Failed to fetch shipping orders'}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => refetch()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // Calculate metrics based on real data
  const totalOrders = shippingOrders.length;
  const arrivalVessels = shippingOrders.filter(so => so.status === ShippingOrderStatus.ARRIVED).length;
  const readyForLoading = shippingOrders.filter(so => so.status === ShippingOrderStatus.READY_FOR_LOADING).length;
  const bunkering = shippingOrders.filter(so => so.status === ShippingOrderStatus.BUNKERING).length;
  const inspecting = shippingOrders.filter(so => so.status === ShippingOrderStatus.INSPECTING).length;
  const validated = shippingOrders.filter(so => so.status === ShippingOrderStatus.VALIDATED).length;
  const departed = shippingOrders.filter(so => so.status === ShippingOrderStatus.DEPARTED).length;

  // Filter orders by status for each tab
  const allOrders = shippingOrders;
  const arrivedOrders = shippingOrders.filter(so => so.status === ShippingOrderStatus.ARRIVED);
  const readyOrders = shippingOrders.filter(so => so.status === ShippingOrderStatus.READY_FOR_LOADING);
  const bunkeringOrders = shippingOrders.filter(so => so.status === ShippingOrderStatus.BUNKERING);
  const inspectingOrders = shippingOrders.filter(so => so.status === ShippingOrderStatus.INSPECTING);
  const validatedOrders = shippingOrders.filter(so => so.status === ShippingOrderStatus.VALIDATED);
  const departedOrders = shippingOrders.filter(so => so.status === ShippingOrderStatus.DEPARTED);

  const getStatusColor = (status: string) => {
    switch (status) {
      case ShippingOrderStatus.ARRIVED:
        return 'info';
      case ShippingOrderStatus.VALIDATED:
        return 'success';
      case ShippingOrderStatus.BUNKERING:
        return 'secondary';
      case ShippingOrderStatus.READY_FOR_LOADING:
        return 'warning';
      case ShippingOrderStatus.DEPARTED:
        return 'primary';
      default:
        return 'default';
    }
  };



  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
            Shipping Orders
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track shipping orders for vessels
          </Typography>
        </Box>
        
        <ShippingOrderDialog>
          <Button variant="contained" startIcon={<Ship />} size="large">
            Create Shipping Order
          </Button>
        </ShippingOrderDialog>
      </Box>

      {/* Key Metrics - Updated for Shipping Order Statuses */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={2}>
            <CardHeader
              title="Total Shipping Orders"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {totalOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                shipping orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={2}>
            <CardHeader
              title="Arrived Vessels"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'info.main' }}>
                {arrivalVessels}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                vessels arrived at the port but has not yet been inspected
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={2}>
            <CardHeader
              title="Ready for Loading"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                {readyForLoading}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ready to load vessels after inspection & bunkering passed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={2}>
            <CardHeader
              title="Bunkering"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'secondary.main' }}>
                {bunkering}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                vessels refueling
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={2}>
            <CardHeader
              title="Validated"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'success.main' }}>
                {validated}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                vessels inspection passed with ({inspecting}) inspections already done
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={2}>
            <CardHeader
              title="Departed"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                {departed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                vessels left
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
            { label: 'All SOs', count: totalOrders },
            { label: 'Arrived', count: arrivalVessels },
            { label: 'Ready for Loading', count: readyForLoading },
            { label: 'Bunkering', count: bunkering },
            { label: 'Validated', count: validated },
            { label: 'Departed', count: departed }
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
        {/* All SOs Tab */}
        <TabPanel value={tabValue} index={0}>
          {viewMode === 'cards' ? (
            <Grid container spacing={3}>
              {allOrders.map((order) => (
                <Grid item xs={12} sm={6} lg={4} key={order.id}>
                  <ShippingOrderCard 
                    order={order} 
                    onViewDetails={handleViewDetails}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SO Number</TableCell>
                    <TableCell>Vessel</TableCell>
                    <TableCell>PO Reference</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.soNumber}</TableCell>
                      <TableCell>{order.vesselNumber}</TableCell>
                      <TableCell>{order.poReference}</TableCell>
                      <TableCell>{order.customerNumber}</TableCell>
                      <TableCell>
                        <Chip label={order.status} color="info" size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewDetails(order)}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton size="small" color="primary">
                            <EditIcon />
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
        {/* Arrived Tab */}
        <TabPanel value={tabValue} index={1}>
          {viewMode === 'cards' ? (
            <Grid container spacing={3}>
              {arrivedOrders.map((order) => (
                <Grid item xs={12} sm={6} lg={4} key={order.id}>
                  <ShippingOrderCard 
                    order={order} 
                    onViewDetails={handleViewDetails}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SO Number</TableCell>
                    <TableCell>Vessel</TableCell>
                    <TableCell>PO Reference</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {arrivedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.soNumber}</TableCell>
                      <TableCell>{order.vesselNumber}</TableCell>
                      <TableCell>{order.poReference}</TableCell>
                      <TableCell>{order.customerNumber}</TableCell>
                      <TableCell>
                        <Chip label={order.status} color="info" size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewDetails(order)}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton size="small" color="primary">
                            <EditIcon />
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

        {/* Ready for Loading Tab */}
        <TabPanel value={tabValue} index={2}>
          {viewMode === 'cards' ? (
            <Grid container spacing={3}>
              {readyOrders.map((order) => (
                <Grid item xs={12} sm={6} lg={4} key={order.id}>
                  <ShippingOrderCard 
                    order={order} 
                    onViewDetails={handleViewDetails}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SO Number</TableCell>
                    <TableCell>Vessel</TableCell>
                    <TableCell>PO Reference</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {readyOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.soNumber}</TableCell>
                      <TableCell>{order.vesselNumber}</TableCell>
                      <TableCell>{order.poReference}</TableCell>
                      <TableCell>{order.customerNumber}</TableCell>
                      <TableCell>
                        <Chip label={order.status} color="warning" size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewDetails(order)}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton size="small" color="primary">
                            <EditIcon />
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

        {/* Bunkering Tab */}
        <TabPanel value={tabValue} index={3}>
          {viewMode === 'cards' ? (
            <Grid container spacing={3}>
              {bunkeringOrders.map((order) => (
                <Grid item xs={12} sm={6} lg={4} key={order.id}>
                  <ShippingOrderCard 
                    order={order} 
                    onViewDetails={handleViewDetails}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SO Number</TableCell>
                    <TableCell>Vessel</TableCell>
                    <TableCell>PO Reference</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bunkeringOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.soNumber}</TableCell>
                      <TableCell>{order.vesselNumber}</TableCell>
                      <TableCell>{order.poReference}</TableCell>
                      <TableCell>{order.customerNumber}</TableCell>
                      <TableCell>
                        <Chip label={order.status} color="secondary" size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewDetails(order)}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton size="small" color="primary">
                            <EditIcon />
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

        {/* Validated Tab */}
        <TabPanel value={tabValue} index={4}>
          {viewMode === 'cards' ? (
            <Grid container spacing={3}>
              {validatedOrders.map((order) => (
                <Grid item xs={12} sm={6} lg={4} key={order.id}>
                  <ShippingOrderCard 
                    order={order} 
                    onViewDetails={handleViewDetails}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SO Number</TableCell>
                    <TableCell>Vessel</TableCell>
                    <TableCell>PO Reference</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {validatedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.soNumber}</TableCell>
                      <TableCell>{order.vesselNumber}</TableCell>
                      <TableCell>{order.poReference}</TableCell>
                      <TableCell>{order.customerNumber}</TableCell>
                      <TableCell>
                        <Chip label={order.status} color="success" size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewDetails(order)}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton size="small" color="primary">
                            <EditIcon />
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

        {/* Departed Tab */}
        <TabPanel value={tabValue} index={5}>
          {viewMode === 'cards' ? (
            <Grid container spacing={3}>
              {departedOrders.map((order) => (
                <Grid item xs={12} sm={6} lg={4} key={order.id}>
                  <ShippingOrderCard 
                    order={order} 
                    onViewDetails={handleViewDetails}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SO Number</TableCell>
                    <TableCell>Vessel</TableCell>
                    <TableCell>PO Reference</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.soNumber}</TableCell>
                      <TableCell>{order.vesselNumber}</TableCell>
                      <TableCell>{order.poReference}</TableCell>
                      <TableCell>{order.customerNumber}</TableCell>
                      <TableCell>
                        <Chip label={order.status} color="primary" size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewDetails(order)}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton size="small" color="primary">
                            <EditIcon />
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

      {/* ADD THE DIALOG AT THE BOTTOM */}
      <ShippingOrderDetailsDialog
        open={isDetailsDialogOpen}
        onClose={handleCloseDetails}
        shippingOrder={selectedShippingOrder as ShippingOrder}
      />
    </Box>
  );
}