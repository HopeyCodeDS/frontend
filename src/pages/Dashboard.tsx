import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Chip,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Schedule as ClockIcon,
  Warning as AlertTriangleIcon,
  LocationOn as MapPinIcon,
  TrendingUp as TrendingUpIcon,
  HistoryToggleOff as ActivityIcon
} from '@mui/icons-material';
import { Package as PackageIcon, CheckCircle, X, AlertTriangle, Calendar, Truck, Warehouse } from 'lucide-react';
import { MATERIALS, TRUCK_STATUS_CONFIG } from '../lib/constants';
import { useDashboardData } from '../hooks/useDashboardData';

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
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Dashboard = () => {
  const { 
    warehouses, 
    trucks, 
    appointments, 
    metrics, 
    todayAppointments, 
    alerts,
    isLoading 
  } = useDashboardData();
  
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const MetricCard = ({
    title,
    value,
    subtitle,
    description,
    icon: Icon,
    color = 'primary'
  }: {
    title: string;
    value: number | string;
    subtitle?: string;
    description: string;
    icon: React.ElementType;
    color?: 'primary' | 'warning' | 'success' | 'error';
  }) => (
    <Card elevation={2}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: `${color}.main`, color: 'white' }}>
            <Icon />
          </Avatar>
        }
        title={title}
        subheader={subtitle}
        titleTypographyProps={{ variant: 'h6' }}
        subheaderTypographyProps={{ variant: 'body2' }}
      />
      <CardContent>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Trucks On-Site"
            value={metrics.trucksOnSite}
            subtitle={`Bridge: ${metrics.trucksAtBridge} • Belt: ${metrics.trucksAtBelt} • Gate: ${metrics.trucksAtGate}`}
            description="Currently in facility"
            icon={Truck}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Warehouse Status"
            value={`${metrics.warehouseCapacity}%`}
            subtitle={`${metrics.warehousesAtCapacity} at capacity`}
            description="Available capacity"
            icon={Warehouse}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active POs"
            value={metrics.outstandingPOs}
            subtitle="Awaiting fulfillment"
            description="Purchase orders"
            icon={PackageIcon}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Pending Operations"
            value={metrics.pendingInspections + metrics.pendingBunkering}
            subtitle="Inspections & bunkering"
            description="Ship operations"
            icon={ClockIcon}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Urgent Alerts */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'warning.main' }}>
              <AlertTriangleIcon />
            </Avatar>
          }
          title="Real-Time Alerts"
          subheader="Live system notifications, truck location updates and vessel departure alerts"
        />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {alerts.map((alert, index) => (
              <Alert
                key={index}
                severity={alert.type as 'warning' | 'error' | 'info'}
                sx={{ justifyContent: 'space-between' }}
              >
                <Box>
                  <AlertTitle>{alert.message}</AlertTitle>
                </Box>
                <Typography variant="caption" sx={{ ml: 2 }}>
                  {alert.time}
                </Typography>
              </Alert>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          borderBottom: 1, 
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}>
          {['Live Operations', 'Capacity Overview', 'Recent Activity'].map((label, index) => (
            <Box
              key={label}
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
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>

      <Card elevation={2}>
        <TabPanel value={tabValue} index={0}>
          {/* Today's Schedule */}
          <Grid item xs={12} lg={6}>
            <Card variant="outlined">
              <CardHeader
                title="Today's Schedule"
                subheader="Upcoming appointments and operations"
              />
              <CardContent>
                {todayAppointments.length > 0 ? (
                  <List>
                    {todayAppointments.map((appointment, index) => (
                      <React.Fragment key={appointment.id}>
                        <ListItem>
                          <ListItemIcon>
                            <ClockIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${appointment.scheduledTime.getHours().toString().padStart(2, '0')}:${appointment.scheduledTime.getMinutes().toString().padStart(2, '0')} - ${MATERIALS[appointment.material]?.name || appointment.material} Delivery`}
                            secondary={`Truck ${appointment.licensePlate} • Warehouse ${appointment.warehouseNumber}`}
                          />
                          <Chip 
                            label={appointment.status} 
                            size="small" 
                            variant="outlined"
                            color={appointment.status === 'scheduled' ? 'primary' : 
                                   appointment.status === 'arrived' ? 'success' : 'default'}
                          />
                        </ListItem>
                        {index < todayAppointments.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No appointments scheduled for today
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid> 
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2}>
            {warehouses.slice(0, 9).map((warehouse) => {
              const capacityPercent = Math.round((warehouse.currentStock / warehouse.maxCapacity) * 100);
              const isAtCapacity = capacityPercent >= 80;

              return (
                <Grid item xs={12} sm={6} md={4} key={warehouse.id}>
                  <Card variant="outlined" sx={{ borderColor: isAtCapacity ? 'warning.main' : 'divider' }}>
                    <CardHeader
                      title={`Warehouse ${warehouse.number}`}
                      subheader={warehouse.sellerName}
                      titleTypographyProps={{ variant: 'h6' }}
                      subheaderTypographyProps={{ variant: 'body2' }}
                    />
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Capacity
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {capacityPercent}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(capacityPercent, 100)}
                            color={isAtCapacity ? 'warning' : 'primary'}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        {warehouse.material && (
                          <Chip
                            label={MATERIALS[warehouse.material as keyof typeof MATERIALS]?.name || warehouse.material}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Card variant="outlined">
            <CardHeader
              title="Recent System Activity"
              subheader="Latest updates and completed operations"
            />
            <CardContent>
              {trucks.length > 0 ? (
                <List>
                  {trucks.slice(0, 8).map((truck, index) => {
                    // Safe access to status config with fallbacks
                    const statusConfig = TRUCK_STATUS_CONFIG[truck.status as keyof typeof TRUCK_STATUS_CONFIG] || {
                      label: truck.status || 'Unknown',
                      color: 'hsl(var(--muted-foreground))',
                      bgColor: 'hsl(var(--muted))'
                    };

                    return (
                      <React.Fragment key={truck.id}>
                        <ListItem>
                          <ListItemIcon>
                            <ActivityIcon color="action" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`Truck ${truck.licensePlate} - ${MATERIALS[truck.material]?.name || truck.material}`}
                            secondary={`${truck.sellerName} • ${truck.warehouseNumber || 'Not assigned'}`}
                          />
                          <Chip
                            label={statusConfig.label}
                            size="small"
                            variant="outlined"
                            sx={{
                              bgcolor: statusConfig.bgColor,
                              color: statusConfig.color,
                              borderColor: statusConfig.color + '40'
                            }}
                          />
                        </ListItem>
                        {index < trucks.slice(0, 8).length - 1 && <Divider />}
                      </React.Fragment>
                    );
                  })}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No truck activity to display
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default Dashboard;