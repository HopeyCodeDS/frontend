import {ReactNode, useContext} from 'react'
import SecurityContext from '../context/SecurityContext'
import { Box, Button, Typography, Paper } from '@mui/material'
import { Login as LoginIcon } from '@mui/icons-material'

export interface RouteGuardProps {
    children: ReactNode
}

export function RouteGuard({children}: RouteGuardProps) {
    const {isAuthenticated, login} = useContext(SecurityContext)

    if (isAuthenticated()) {
        return <>{children}</>
    } else { // fallback, the security context will already redirect to KC...
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '50vh' 
            }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Authentication Required
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Please log in to access this page
                    </Typography>
                    <Button 
                        variant="contained" 
                        startIcon={<LoginIcon />}
                        onClick={login}
                        size="large"
                    >
                        Login
                    </Button>
                </Paper>
            </Box>
        )
    }
}
