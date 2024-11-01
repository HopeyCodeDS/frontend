import {AppointmentFormData} from "../model/Appointment.ts";
import {useState} from "react";

interface AppointmentFormProps {
    onSubmit: (appointmentFormData: AppointmentFormData) => void;
}

export function AppointmentForm({onSubmit}: AppointmentFormProps) {
    const [appointmentFormData, setAppointmentFormData] = useState<AppointmentFormData>({
        licensePlate: '',
        materialType: '',
        arrivalTime: new Date(),
        sellerId: '',
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setAppointmentFormData((prevData) => ({
            ...prevData,
            [name]: name === 'arrivalTime' ? new Date(value) : value, // Special handling for Date
        }));
    };

    // Submit handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(appointmentFormData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="licensePlate">License Plate:</label>
                <input
                    type="text"
                    id="licensePlate"
                    name="licensePlate"
                    value={appointmentFormData.licensePlate}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="materialType">Material Type:</label>
                <input
                    type="text"
                    id="materialType"
                    name="materialType"
                    value={appointmentFormData.materialType}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="arrivalTime">Arrival Time:</label>
                <input
                    type="datetime-local"
                    id="arrivalTime"
                    name="arrivalTime"
                    value={appointmentFormData.arrivalTime.toISOString().slice(0, 16)} // Format for datetime-local
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="sellerId">Seller ID:</label>
                <input
                    type="text"
                    id="sellerId"
                    name="sellerId"
                    value={appointmentFormData.sellerId}
                    onChange={handleChange}
                    required
                />
            </div>

            <button type="submit">Submit</button>
        </form>
    );
}