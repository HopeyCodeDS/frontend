import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Paper
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <Paper elevation={3} sx={{ p: 6, borderRadius: 2 }}>
          <Typography variant="h1" component="h1" sx={{ 
            fontSize: '6rem', 
            fontWeight: 'bold', 
            color: 'text.secondary',
            mb: 2
          }}>
            404
          </Typography>
          
          <Typography variant="h4" component="h2" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: 'text.primary'
          }}>
            Page Not Found
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            The page you're looking for doesn't exist or has been moved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              size="large"
            >
              Go Back
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              size="large"
            >
              Go Home
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={() => navigate('/warehouses')}
              size="large"
            >
              Browse Warehouses
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
