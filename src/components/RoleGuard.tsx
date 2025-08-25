import {ReactNode, useContext} from 'react'
import SecurityContext from '../context/SecurityContext'
import { Box, Typography, Paper } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'

export interface RoleGuardProps {
    children: ReactNode
    requiredRoles: string[]
    fallback?: ReactNode
}

export function RoleGuard({children, requiredRoles, fallback}: RoleGuardProps) {
    const {hasAnyRole, userRoles} = useContext(SecurityContext)

    // Add debug logging
    console.log('RoleGuard check:', {
        requiredRoles,
        userRoles,
        hasAnyRole: hasAnyRole(requiredRoles)
    })

    if (hasAnyRole(requiredRoles)) {
        return <>{children}</>
    } else {
        if (fallback) {
            return <>{fallback}</>
        }
        
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '50vh' 
            }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <LockIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        Access Denied
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        You don't have permission to access this page
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Required roles: {requiredRoles.join(', ')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Your roles: {userRoles.join(', ') || 'None'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Total roles found: {userRoles.length}
                    </Typography>
                </Paper>
            </Box>
        )
    }
}
