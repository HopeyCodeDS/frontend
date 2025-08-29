import * as React from "react"
import { useToast } from "../../hooks/use-toast"
import { Toast } from "./toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          open={toast.open}
          onOpenChange={toast.onOpenChange}
          variant={toast.variant}
          title={toast.title}
          description={toast.description}
          action={toast.action}
        />
      ))}
    </>
  )
}
