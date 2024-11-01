import axios from 'axios'
import {Warehouse} from "../model/Warehouse.ts"
import {Appointment, NewAppointment} from "../model/Appointment.ts"

export async function getWarehouses() {
    const {data: warehouses} = await axios.get<Warehouse[]>("/warehouses")
    return warehouses
}

export async function getWarehousesBySellerId(sellerId: string) {
    const {data: boards} = await axios.get<Warehouse[]>(`/warehouses?owner.name_like=${sellerId}`)
    return boards
}

export async function getWarehouse(id: string) {
    const {data: warehouse} = await axios.get<Warehouse>(`/warehouses/${id}?_embed=appointments`)
    return warehouse
}

export async function addAppointment(appointment: NewAppointment) {
    const {data: newAppointment} = await axios.post<Appointment>('/appointments', appointment)
    return newAppointment
}

