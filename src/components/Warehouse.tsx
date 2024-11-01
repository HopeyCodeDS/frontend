import {Appointment} from "../model/Appointment.ts";
import {useLocalStorage} from "@uidotdev/usehooks";

interface WarehouseProps {
    appointment: Appointment;
}

export function Warehouse({appointment}: WarehouseProps) {
    const [showFields, setShowFields] = useLocalStorage("show-fields", true);

    return (
        <div className="warehouse">
            <h2>Warehouse Information</h2>

            {/* Toggle Button for Showing/Hiding Fields */}
            <button onClick={() => setShowFields(!showFields)}>
                {showFields ? "Hide Details" : "Show Details"}
            </button>

            {/* Conditionally Render Appointment Fields */}
            {showFields && (
                <div className="appointment-details">
                    <p><strong>License Plate:</strong> {appointment.licensePlate}</p>
                    <p><strong>Material Type:</strong> {appointment.materialType}</p>
                    <p><strong>Arrival Time:</strong> {new Date(appointment.arrivalTime).toLocaleString()}</p>
                    <p><strong>Seller ID:</strong> {appointment.sellerId}</p>
                </div>
            )}
        </div>
    );
}
