import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {landsideAPI} from '@/services/apiService';
import {mockData} from '@/lib/mock-data';
import {Appointment} from '@/types';

// Query keys for appointment data
export const appointmentKeys = {
    all: ['appointments'] as const,
    lists: () => [...appointmentKeys.all, 'list'] as const,
    list: (filters: string) => [...appointmentKeys.lists(), {filters}] as const,
    details: () => [...appointmentKeys.all, 'detail'] as const,
    detail: (id: string) => [...appointmentKeys.details(), id] as const,
    overview: () => [...appointmentKeys.all, 'overview'] as const,
    byStatus: (status: string) => [...appointmentKeys.all, 'status', status] as const,
};

// Helper function to transform backend appointment data to frontend format
const transformBackendAppointment = (apt: any) => {
    let scheduledTime: Date;
    if (apt.scheduledTime instanceof Date) {
        scheduledTime = apt.scheduledTime;
    } else if (typeof apt.scheduledTime === 'string') {
        // Parse the "dd/MM/yyyy HH:mm" format
        const [datePart, timePart] = apt.scheduledTime.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hour, minute] = timePart.split(':');
        scheduledTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
    } else if (apt.scheduledTime === null) {
        // For cancelled appointments, use arrivalWindow startTime as fallback
        if (apt.arrivalWindow && apt.arrivalWindow.startTime) {
            const [datePart, timePart] = apt.arrivalWindow.startTime.split(' ');
            const [day, month, year] = datePart.split('/');
            const [hour, minute] = timePart.split(':');
            scheduledTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
        } else {
            scheduledTime = new Date(); // fallback to current time
        }
    } else {
        console.warn('Invalid scheduledTime for appointment:', apt.appointmentId, apt.scheduledTime);
        scheduledTime = new Date(); // fallback
    }

    // Safely handle arrivalWindow - backend sends startTime and endTime
    let arrivalWindow: { start: Date; end: Date };
    if (apt.arrivalWindow && apt.arrivalWindow.startTime && apt.arrivalWindow.endTime) {
        // Parse startTime and endTime from "dd/MM/yyyy HH:mm" format
        const parseDateTime = (dateTimeStr: string) => {
            const [datePart, timePart] = dateTimeStr.split(' ');
            const [day, month, year] = datePart.split('/');
            const [hour, minute] = timePart.split(':');
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
        };

        arrivalWindow = {
            start: parseDateTime(apt.arrivalWindow.startTime),
            end: parseDateTime(apt.arrivalWindow.endTime)
        };
    } else {
        // Calculate arrival window from scheduled time if not provided
        const start = new Date(scheduledTime);
        const end = new Date(scheduledTime.getTime() + 60 * 60 * 1000); // +1 hour
        arrivalWindow = {start, end};
    }

    // Normalize status to lowercase to match frontend expectations
    const normalizeStatus = (status: string) => {
        if (!status) return 'unknown';
        return status.toLowerCase();
    };

    // Transform to frontend format
    return {
        id: apt.appointmentId, 
        truckId: apt.appointmentId, 
        licensePlate: apt.licensePlate,
        sellerId: apt.sellerId,
        sellerName: apt.sellerName,
        material: apt.rawMaterialName, 
        scheduledTime,
        arrivalWindow,
        status: normalizeStatus(apt.status), 
        warehouseNumber: 'Unknown', 
        truckType: apt.truckType 
    };
};

// Hook to get all appointments
export function useAppointments() {
    return useQuery({
        queryKey: appointmentKeys.lists(),
        queryFn: async () => {
            try {
                console.log('🔄 Fetching appointments from backend...');
                const data = await landsideAPI.getAppointments();

                if (data && Array.isArray(data)) {
                    console.log('✅ Backend returned array of appointments:', data.length);
                    console.log('🔍 First appointment structure:', data[0]);

                    // Transform API data to match frontend types
                    const transformedData = data.map(transformBackendAppointment);

                    console.log('✅ Transformed appointments successfully:', transformedData.length);
                    return transformedData;
                } else {
                    console.log('⚠️ Backend returned invalid data, using mock data');
                    return mockData.appointments;
                }
            } catch (error) {
                console.log('❌ API error, using mock data:', error);
                return mockData.appointments;
            }
        },
        staleTime: 30000,
        gcTime: 5 * 60 * 1000,
        select: (data) => {
            if (Array.isArray(data)) {
                return data;
            }
            console.warn('Data is not an array, falling back to mock data');
            return mockData.appointments;
        }
    });
}

// Hook to get appointments by status
export function useAppointmentsByStatus(status: string) {
    return useQuery({
        queryKey: appointmentKeys.byStatus(status),
        queryFn: async () => {
            try {
                const allAppointments = await landsideAPI.getAppointments();
                if (allAppointments && Array.isArray(allAppointments)) {
                    const transformedData = allAppointments.map(transformBackendAppointment);
                    return transformedData.filter(apt => apt.status === status);
                }
                return mockData.appointments.filter(apt => apt.status === status);
            } catch (error) {
                console.warn(`Appointments by status API call failed for ${status}, using mock data:`, error);
                return mockData.appointments.filter(apt => apt.status === status);
            }
        },
        enabled: !!status,
        staleTime: 30000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
}

// Hook to get individual appointment details
export function useAppointment(id: string) {
    return useQuery({
        queryKey: appointmentKeys.detail(id),
        queryFn: async () => {
            try {
                const allAppointments = await landsideAPI.getAppointments();
                if (allAppointments && Array.isArray(allAppointments)) {
                    const appointment = allAppointments.find(apt => apt.appointmentId === id);
                    if (appointment) {
                        return transformBackendAppointment(appointment);
                    }
                }

                // Fallback to mock data
                const mockAppointment = mockData.appointments.find(apt => apt.id === id);
                if (mockAppointment) {
                    console.log(`Using mock data for appointment ${id}`);
                    return mockAppointment;
                }
                throw new Error(`Appointment ${id} not found`);
            } catch (error) {
                console.warn(`Appointment detail API call failed for ${id}, using mock data:`, error);
                const mockAppointment = mockData.appointments.find(apt => apt.id === id);
                if (mockAppointment) {
                    return mockAppointment;
                }
                throw error;
            }
        },
        enabled: !!id,
        staleTime: 30000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
}

// Hook to create a new appointment
export function useCreateAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (appointmentData: any) => {
            const newAppointment = await landsideAPI.createAppointment(appointmentData);
            if (!newAppointment) {
                throw new Error('Failed to create appointment');
            }
            return newAppointment;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: appointmentKeys.lists()});
            queryClient.invalidateQueries({queryKey: appointmentKeys.overview()});
        },
    });
}

// Hook to update an appointment
export function useUpdateAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({id, updates}: { id: string; updates: Partial<Appointment> }) => {
            const updatedAppointment = await landsideAPI.updateAppointment(id, updates);
            if (!updatedAppointment) {
                throw new Error(`Failed to update appointment ${id}`);
            }
            return updatedAppointment;
        },
        onSuccess: (updatedAppointment) => {
            queryClient.setQueryData(appointmentKeys.detail(updatedAppointment.id), updatedAppointment);
            queryClient.invalidateQueries({queryKey: appointmentKeys.lists()});
            queryClient.invalidateQueries({queryKey: appointmentKeys.overview()});
        },
    });
}

// Hook to delete an appointment
export function useDeleteAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const success = await landsideAPI.deleteAppointment(id);
            if (!success) {
                throw new Error(`Failed to delete appointment ${id}`);
            }
            return id;
        },
        onSuccess: (deletedId) => {
            queryClient.removeQueries({queryKey: appointmentKeys.detail(deletedId)});
            queryClient.invalidateQueries({queryKey: appointmentKeys.lists()});
            queryClient.invalidateQueries({queryKey: appointmentKeys.overview()});
        },
    });
}

// Hook to get appointment statistics/overview
export function useAppointmentOverview() {
    return useQuery({
        queryKey: appointmentKeys.overview(),
        queryFn: async () => {
            try {
                const data = await landsideAPI.getAppointments();
                if (data && Array.isArray(data)) {
                    const transformedData = data.map(transformBackendAppointment);

                    return {
                        total: transformedData.length,
                        scheduled: transformedData.filter(apt => apt.status === 'scheduled').length,
                        inProgress: transformedData.filter(apt => apt.status !== 'scheduled' && apt.status !== 'cancelled' && apt.status !== 'departed').length,
                        departed: transformedData.filter(apt => apt.status === 'departed').length,
                        cancelled: transformedData.filter(apt => apt.status === 'cancelled').length,
                    };
                }

                // Fallback to mock data
                const mockAppointments = mockData.appointments;
                return {
                    total: mockAppointments.length,
                    scheduled: mockAppointments.filter(apt => apt.status === 'scheduled').length,
                    inProgress: mockAppointments.filter(apt => apt.status !== 'scheduled' && apt.status !== 'cancelled' && apt.status !== 'departed').length,
                    departed: mockAppointments.filter(apt => apt.status === 'departed').length,
                    cancelled: mockAppointments.filter(apt => apt.status === 'cancelled').length,
                };
            } catch (error) {
                console.log('Appointment overview API call failed, using mock data:', error);
                const mockAppointments = mockData.appointments;
                return {
                    total: mockAppointments.length,
                    scheduled: mockAppointments.filter(apt => apt.status === 'scheduled').length,
                    inProgress: mockAppointments.filter(apt => apt.status !== 'scheduled' && apt.status !== 'cancelled' && apt.status !== 'departed').length,
                    departed: mockAppointments.filter(apt => apt.status === 'departed').length,
                    cancelled: mockAppointments.filter(apt => apt.status === 'cancelled').length,
                };
            }
        },
        staleTime: 30000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });
}
