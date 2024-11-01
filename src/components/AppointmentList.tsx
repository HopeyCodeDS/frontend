import {Warehouse} from "../model/Warehouse.ts";
import {Box, List, ListItem, ListItemText} from "@mui/material";

interface AppointmentListProps {
    warehouse: Warehouse;
}

export function AppointmentList({warehouse}: AppointmentListProps) {
    return (
        <Box>
            <h3>Appointments for Warehouse {warehouse.id}</h3>
            <List>
                {warehouse.appointment ? (
                    <ListItem key={warehouse.appointment.id}>
                        <ListItemText
                            primary={`License Plate: ${warehouse.appointment.licensePlate}`}
                            secondary={`Material Type: ${warehouse.appointment.materialType}, Arrival Time: ${new Date(
                                warehouse.appointment.arrivalTime
                            ).toLocaleString()}`}
                        />
                    </ListItem>
                ) : (
                    <p>No appointments available.</p>
                )}
            </List>
        </Box>
    );
}
