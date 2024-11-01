import {useParams} from "react-router-dom";
import {useAccount, useAddAppointment} from "../hooks/useWarehouses.ts";
import {Box} from "@mui/material";
import {AppointmentForm} from "./AppointmentForm.tsx";
import {AppointmentList} from "./AppointmentList.tsx";
import {AppointmentFormData, NewAppointment} from "../model/Appointment.ts";

const hardCodedSellerId = "b78c50cd-a93b-4881-a37a-bc79408ef9d7"

export function WarehouseDetail() {
    const {id} = useParams();
    const {warehouse, isLoading: isLoadingWarehouse, isError} = useAccount(id!);
    const {addAppointment, isPending: addAppointmentPending, isError: addAppointmentError} = useAddAppointment(id!);

    if (isLoadingWarehouse || addAppointmentPending) {
        return <div>Loading...</div>;
    }

    if (isError || addAppointmentError || !warehouse) {
        return <div>Error loading warehouse data!</div>;
    }

    function handleAddAppointment(appointmentFormData: AppointmentFormData) {
        if (warehouse) {
            const newAppointment: NewAppointment = {
                ...appointmentFormData,
                arrivalTime: new Date(),
                sellerId: hardCodedSellerId,
            };
            addAppointment(newAppointment);
        }
    }

    return (
        <Box
            sx={{
                mt: 5,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 2,
            }}
        >
            <h2>Warehouse: {warehouse.id}</h2>
            <p>Capacity: {warehouse.capacity}</p>
            <p>Current Load: {warehouse.currentLoad}</p>

            <AppointmentForm onSubmit={handleAddAppointment}/>
            <AppointmentList warehouse={warehouse}/>
        </Box>
    );
}
