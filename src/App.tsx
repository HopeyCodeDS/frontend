import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, AppBar, Toolbar, Typography, IconButton, Avatar, Button } from '@mui/material';
import { Menu as MenuIcon, Warehouse as WarehouseIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar.tsx";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Trucks from "./pages/Trucks";
import Warehouses from "./pages/Warehouses";
import PurchaseOrders from "./pages/PurchaseOrders";
import ShippingOrders from "./pages/ShippingOrders";
import Appointments from "./pages/Appointments";
import { useState, useContext } from 'react';
import { theme } from './theme/theme';
import SecurityContextProvider from "./context/SecurityContextProvider.tsx";
import SecurityContext from "./context/SecurityContext.tsx";
import { RouteGuard } from "./components/RouteGuard.tsx";
import { RoleGuard } from "./components/RoleGuard.tsx";
import { PAGE_ACCESS_ROLES } from './lib/constants.ts';
import { Toaster } from "./components/ui/toaster"

const queryClient = new QueryClient();

// Header component with authentication
function Header({ 
  sidebarOpen, 
  toggleSidebar, 
  sidebarCollapsed 
}: { 
  
  sidebarOpen: boolean; 
  toggleSidebar: () => void; 
  sidebarCollapsed: boolean;
}) {
  const {logout, loggedInUser, userRoles} = useContext(SecurityContext)
  
  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ 
        backgroundColor: 'background.paper', 
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        width: '100%'
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          sx={{ 
            mr: 2, 
            display: { xs: 'block', md: 'none' },
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main', 
              width: 32, 
              height: 32,
              border: '2px solid rgba(255,255,255,0.2)'
            }}
          >
            <WarehouseIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Typography variant="h6" component="h1" sx={{ 
            fontWeight: 600,
            color: 'text.primary'
          }}>
            KdG MineralFlow - Logistics Management System
          </Typography>
        </Box>
        
        {/* User info and logout button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Welcome, {loggedInUser || 'User'}
          </Typography>
          {/* <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 200 }}>
            Roles: {userRoles.join(', ') || 'None'}
          </Typography> */}
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={logout}
            size="small"
            sx={{ 
              borderColor: 'divider',
              color: 'text.secondary',
              '&:hover': { 
                borderColor: 'primary.main',
                color: 'primary.main' 
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Calculate the main content margin based on sidebar state
  const getMainContentMargin = () => {
    if (sidebarCollapsed) {
      return { xs: 0, md: '64px' }; 
    }
    return { xs: 0, md: '280px' }; 
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SecurityContextProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter 
                future={{ 
                  v7_startTransition: true,
                  v7_relativeSplatPath: true 
                }}
              >
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              <AppSidebar 
                open={sidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                collapsed={sidebarCollapsed}
                onToggleCollapse={toggleCollapse}
              />
              
              <Box 
                component="main" 
                sx={{ 
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '100vh',
                  ml: getMainContentMargin(), // Responsive margin
                  transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                  }),
                  width: {
                    xs: '100%',
                    md: `calc(100% - ${sidebarCollapsed ? '64px' : '280px'})`
                  }
                }}
              >
                <Header 
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                  sidebarCollapsed={sidebarCollapsed}
                />
                
                <Box sx={{ 
                  flexGrow: 1, 
                  p: 3,
                  width: '100%',
                  overflow: 'hidden'
                }}>
                  <Routes>
                    <Route path="/" element={
                      <RouteGuard>
                        <Index/>
                      </RouteGuard>
                    }/>
                    <Route path="/trucks" element={
                      <RouteGuard>
                        <RoleGuard requiredRoles={[...PAGE_ACCESS_ROLES.TRUCKS]}>
                          <Trucks/>
                        </RoleGuard>
                      </RouteGuard>
                    }/>
                    <Route path="/warehouses" element={
                      <RouteGuard>
                        <RoleGuard requiredRoles={[...PAGE_ACCESS_ROLES.WAREHOUSES]}>
                          <Warehouses/>
                        </RoleGuard>
                      </RouteGuard>
                    }/>
                    <Route path="/purchase-orders" element={
                      <RouteGuard>
                        <RoleGuard requiredRoles={[...PAGE_ACCESS_ROLES.PURCHASE_ORDERS]}>
                          <PurchaseOrders/>
                        </RoleGuard>
                      </RouteGuard>
                    }/>
                    <Route path="/shipping-orders" element={
                      <RouteGuard>
                        <RoleGuard requiredRoles={[...PAGE_ACCESS_ROLES.SHIPPING_ORDERS]}>
                          <ShippingOrders/>
                        </RoleGuard>
                      </RouteGuard>
                    }/>
                    <Route path="/appointments" element={
                      <RouteGuard>
                        <RoleGuard requiredRoles={[...PAGE_ACCESS_ROLES.APPOINTMENTS]}>
                          <Appointments/>
                        </RoleGuard>
                      </RouteGuard>
                    }/>
                    <Route path="*" element={<NotFound/>}/>
                  </Routes>
                </Box>
              </Box>
            </Box>
            <Toaster />
          </BrowserRouter>
        </ThemeProvider>
      </SecurityContextProvider>
    </QueryClientProvider>
  );
};

export default App;
