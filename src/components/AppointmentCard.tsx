import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {Appointment} from "../model/Appointment.ts";

dayjs.extend(relativeTime);

interface AppointmentCardProps {
    appointment: Appointment;
}

export function AppointmentCard({appointment}: AppointmentCardProps) {
    const relativeTimeAgo = dayjs(appointment.arrivalTime).fromNow();

    return (
        <div className="appointment-card">
            <h3>Appointment Details</h3>
            <p><strong>License Plate:</strong> {appointment.licensePlate}</p>
            <p><strong>Material Type:</strong> {appointment.materialType}</p>
            <p><strong>Arrival Time:</strong> {dayjs(appointment.arrivalTime).format("YYYY-MM-DD HH:mm")}</p>
            <p><strong>Relative Time Ago:</strong> {relativeTimeAgo}</p>
            <p><strong>Seller ID:</strong> {appointment.sellerId}</p>
        </div>
    );
}
