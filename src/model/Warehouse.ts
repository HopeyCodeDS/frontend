import {Seller} from "./Seller.ts";
import {Appointment} from "./Appointment.ts";

export type Warehouse = {
    id: string;
    seller: Seller
    appointment: Appointment
    capacity: number
    currentLoad: number

}