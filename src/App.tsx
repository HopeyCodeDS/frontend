import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import { Menu as MenuIcon, Warehouse as WarehouseIcon } from '@mui/icons-material';
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
import { useState } from 'react';
import { theme } from './theme/theme';

const queryClient = new QueryClient();

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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                </Toolbar>
              </AppBar>
              
              <Box sx={{ 
                flexGrow: 1, 
                p: 3,
                width: '100%',
                overflow: 'hidden'
              }}>
                <Routes>
                  <Route path="/" element={<Index/>}/>
                  <Route path="/trucks" element={<Trucks/>}/>
                  <Route path="/warehouses" element={<Warehouses/>}/>
                  <Route path="/purchase-orders" element={<PurchaseOrders/>}/>
                  <Route path="/shipping-orders" element={<ShippingOrders/>}/>
                  <Route path="/appointments" element={<Appointments/>}/>
                  <Route path="*" element={<NotFound/>}/>
                </Routes>
              </Box>
            </Box>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
