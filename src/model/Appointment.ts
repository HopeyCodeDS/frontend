export type Appointment = {
    id: string
    licensePlate: string
    materialType: string
    arrivalTime: Date
    sellerId: string
}

export type NewAppointment = Omit<Appointment, 'id'>
export type AppointmentFormData = Omit<Appointment, 'id'>