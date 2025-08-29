import { NavLink, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { Warehouse, Package, Ship, Calendar, Truck} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: DashboardIcon,
  },
  {
    title: 'Truck Management',
    url: '/trucks',
    icon: Truck,
  },
  {
    title: 'Warehouse Overview',
    url: '/warehouses',
    icon: Warehouse,
  },
  {
    title: 'Purchase Orders',
    url: '/purchase-orders',
    icon: Package,
  },
  {
    title: 'Shipping Orders',
    url: '/shipping-orders',
    icon: Ship,
  },
  {
    title: 'Appointments',
    url: '/appointments',
    icon: Calendar,
  },
];



interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function AppSidebar({ open, onClose, collapsed, onToggleCollapse }: AppSidebarProps) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const drawerWidth = collapsed ? 64 : 280;

  const drawerContent = (
    <Box sx={{ width: drawerWidth }}>
      {/* Header with Logo */}
      <Box sx={{ 
        p: collapsed ? 1 : 3, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between'
      }}>
        {!collapsed && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              
              <Box>
                <Typography variant="h5" component="h2" sx={{ 
                  fontWeight: 'bold', 
                  color: 'text.primary',
                  fontSize: '1.5rem',
                  lineHeight: 1.2
                }}>
                  KdG MineralFlow
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'text.secondary', 
                  mt: 0.5,
                  fontSize: '0.875rem'
                }}>
                  Logistics Dashboard
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={onToggleCollapse} 
              size="small"
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </>
        )}
        {collapsed && (
          <IconButton 
            onClick={onToggleCollapse} 
            size="small"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ py: 2 }}>
        {!collapsed && (
          <Typography variant="overline" sx={{ 
            px: 3, 
            color: 'text.secondary', 
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            Navigation
          </Typography>
        )}
        <List sx={{ mt: collapsed ? 0 : 1 }}>
          {navigationItems.map((item) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.url}
                selected={isActive(item.url)}
                onClick={isMobile ? onClose : undefined}
                sx={{
                  mx: collapsed ? 0.5 : 1,
                  borderRadius: 2,
                  minHeight: collapsed ? 48 : 56,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(74, 222, 128, 0.15)',
                    color: 'primary.main',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(74, 222, 128, 0.2)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: 'inherit', 
                  minWidth: collapsed ? 'auto' : 40,
                  mr: collapsed ? 0 : 2
                }}>
                  <item.icon sx={{ fontSize: collapsed ? 20 : 22 }} />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText 
                    primary={item.title} 
                    primaryTypographyProps={{ 
                      fontWeight: isActive(item.url) ? 600 : 500,
                      fontSize: '0.95rem'
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
    </Box>
  );

  return (
    <>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          zIndex: 1200,
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: 1,
            borderColor: 'divider',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            position: 'fixed',
            left: 0,
            top: 0,
            height: '100vh',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}