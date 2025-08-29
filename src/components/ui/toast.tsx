import * as React from "react"
import { Alert, AlertTitle, Box, Slide, Snackbar } from "@mui/material"

export interface ToastProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

export type ToastActionElement = React.ReactElement

export function Toast({
  open = false,
  onOpenChange,
  variant = "default",
  title,
  description,
  action
}: ToastProps) {
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    onOpenChange?.(false)
  }

  const getSeverity = (variant: string) => {
    switch (variant) {
      case "destructive":
        return "error"
      case "success":
        return "success"
      case "warning":
        return "warning"
      case "info":
        return "info"
      default:
        return "info"
    }
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      TransitionComponent={(props) => <Slide {...props} direction="up" />}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={getSeverity(variant)}
        variant="filled"
        sx={{ width: '100%', minWidth: 300 }}
        action={action}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {description}
      </Alert>
    </Snackbar>
  )
}
