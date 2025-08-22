import React, { useState } from 'react';
import {
  Box,
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
  Tooltip,
  Badge,
  Tabs,
  Tab,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  Warning as AlertTriangleIcon,
  Event as EventIcon,
  AttachMoney as AttachMoneyIcon,
  Apartment
} from '@mui/icons-material';
import { Package, CheckCircle, X, AlertTriangle, Calendar } from 'lucide-react';
import { PurchaseOrder } from '@/types';
import { usePurchaseOrders } from '@/hooks/usePurchaseOrderData';
import { PurchaseOrderDialog } from '@/components/dialogs/PurchaseOrderDialog';
import { PurchaseOrderDetailsDialog } from '@/components/dialogs/PurchaseOrderDetailsDialog';

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

// Purchase Order Card Component
const PurchaseOrderCard = ({ order, onViewDetails }: { 
  order: PurchaseOrder; 
  onViewDetails: (order: PurchaseOrder) => void;
}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
      case 'fulfilled':
        return 'success';
      case 'outstanding':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fulfilled':
        return <CheckCircle />;
      case 'outstanding':
        return <AlertTriangle />;
      case 'cancelled':
        return <X />;
            default:
        return <Calendar />;
        }
    };

    return (
    <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <Package />
          </Avatar>
        }
        title={`PO: ${order.poNumber}`}
        action={
          <Chip 
            label={order.status} 
            color={getStatusColor(order.status) as any}
            size="small"
            icon={getStatusIcon(order.status)}
          />
        }
        titleTypographyProps={{ variant: 'h6' }}
        subheaderTypographyProps={{ variant: 'body2' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Apartment fontSize="small" />
          <Typography className='font-medium' color="text.secondary" gutterBottom>
            Customer: {order.customerName}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventIcon fontSize="small" />
          <Typography className='font-medium' color="text.secondary" gutterBottom>
            Order Date: {order.orderDate.toLocaleDateString()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Package fontSize="small" />
          <Typography className='font-medium' color="text.secondary" gutterBottom>
            Items: {order.items?.length || 0}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AttachMoneyIcon fontSize="small" />
          <Typography className='font-medium' color="text.secondary">
            Total Value: ${order.totalValue?.toLocaleString() || '0'}
          </Typography>
        </Box>
      </CardContent>
      <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1, mt: 1, width: '100%', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<ViewIcon />}
          onClick={() => onViewDetails(order)} 
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

export default function PurchaseOrders() {
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  // State variables for the dialog
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Use React Query hook to fetch purchase orders
  const { data: purchaseOrders = [], isLoading, error, refetch } = usePurchaseOrders();

  // Handler functions
  const handleViewDetails = (order: PurchaseOrder) => {
    console.log('View Details clicked for order:', order);
    setSelectedPurchaseOrder(order);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsDialogOpen(false);
    setSelectedPurchaseOrder(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filter orders by status
  const outstandingOrders = purchaseOrders.filter(po => po.status === 'outstanding');
  const fulfilledOrders = purchaseOrders.filter(po => po.status === 'fulfilled');
  const cancelledOrders = purchaseOrders.filter(po => po.status === 'cancelled');
  
  // Calculate totals
  const totalOrders = purchaseOrders.length;
  const totalValue = purchaseOrders.reduce((sum, po) => sum + (po.totalValue || 0), 0);
  const outstandingValue = outstandingOrders.reduce((sum, po) => sum + (po.totalValue || 0), 0);
  const fulfilledValue = fulfilledOrders.reduce((sum, po) => sum + (po.totalValue || 0), 0);

  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
          Purchase Orders
        </Typography>
        <LinearProgress sx={{ mt: 2 }} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading purchase orders...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
          Purchase Orders
        </Typography>
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading purchase orders: {error.message}
          <Button onClick={() => refetch()} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

    return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
            Purchase Orders
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track purchase orders for raw materials
          </Typography>
        </Box>
        
        <PurchaseOrderDialog>
          <Button
            variant="contained"
            startIcon={<Package />}
            size="large"
          >
            Create Purchase Order
                    </Button>
        </PurchaseOrderDialog>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardHeader
              title="Total Orders"
              titleTypographyProps={{ variant: 'h6' }}
            />
                    <CardContent>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {totalOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                purchase orders
              </Typography>
                    </CardContent>
                </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardHeader
              title="Total Value"
              titleTypographyProps={{ variant: 'h6' }}
            />
                    <CardContent>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                ${totalValue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                total value
              </Typography>
                    </CardContent>
                </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardHeader
              title="Outstanding"
              titleTypographyProps={{ variant: 'h6' }}
            />
                    <CardContent>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                ${outstandingValue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                pending fulfillment
              </Typography>
                    </CardContent>
                </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardHeader
              title="Fulfilled"
              titleTypographyProps={{ variant: 'h6' }}
            />
                    <CardContent>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'success.main' }}>
                ${fulfilledValue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                completed orders
              </Typography>
                    </CardContent>
                </Card>
        </Grid>
      </Grid>

      {/* Tabs and Content */}
      <Card elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="purchase order tabs">
            <Tab label={`Outstanding (${outstandingOrders.length})`} />
            <Tab label={`Fulfilled (${fulfilledOrders.length})`} />
            <Tab label={`Cancelled (${cancelledOrders.length})`} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {outstandingOrders.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No outstanding purchase orders
              </Typography>
            </Box>
          ) : (
            viewMode === 'cards' ? (
              <Grid container spacing={3}>
                {outstandingOrders.map((order) => (
                  <Grid item xs={12} sm={6} lg={4} key={order.id}>
                    <PurchaseOrderCard 
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
                      <TableCell>PO Number</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Order Date</TableCell>
                      <TableCell>Total Value</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {outstandingOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.poNumber}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.orderDate.toLocaleDateString()}</TableCell>
                        <TableCell>${order.totalValue?.toLocaleString() || '0'}</TableCell>
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
            )
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {fulfilledOrders.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No fulfilled purchase orders
              </Typography>
            </Box>
          ) : (
            viewMode === 'cards' ? (
              <Grid container spacing={3}>
                {fulfilledOrders.map((order) => (
                  <Grid item xs={12} sm={6} lg={4} key={order.id}>
                    <PurchaseOrderCard 
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
                      <TableCell>PO Number</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Order Date</TableCell>
                      <TableCell>Total Value</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fulfilledOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.poNumber}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.orderDate.toLocaleDateString()}</TableCell>
                        <TableCell>${order.totalValue?.toLocaleString() || '0'}</TableCell>
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
            )
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {cancelledOrders.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No cancelled purchase orders
              </Typography>
            </Box>
          ) : (
            viewMode === 'cards' ? (
              <Grid container spacing={3}>
                {cancelledOrders.map((order) => (
                  <Grid item xs={12} sm={6} lg={4} key={order.id}>
                    <PurchaseOrderCard 
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
                      <TableCell>PO Number</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Order Date</TableCell>
                      <TableCell>Total Value</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cancelledOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.poNumber}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.orderDate.toLocaleDateString()}</TableCell>
                        <TableCell>${order.totalValue?.toLocaleString() || '0'}</TableCell>
                        <TableCell>
                          <Chip label={order.status} color="error" size="small" />
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
            )
          )}
        </TabPanel>
      </Card>

      {/* Details Dialog */}
      <PurchaseOrderDetailsDialog
        open={isDetailsDialogOpen}
        onClose={handleCloseDetails}
        purchaseOrder={selectedPurchaseOrder}
      />
    </Box>
    );
}