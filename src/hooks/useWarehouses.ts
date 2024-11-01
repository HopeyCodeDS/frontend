import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {addAppointment, getWarehouse, getWarehouses, getWarehousesBySellerId} from "../services/warehouseDataService.ts"
import {NewAppointment} from "../model/Appointment.ts"

export function useWarehousesBySellerClientSide(sellerId: string) {
    const {isLoading, isError, data: warehouses} = useQuery({queryKey: ['warehouses'], queryFn: () => getWarehouses()})
    const filteredWarehouses = warehouses?.filter((warehouse) => warehouse.seller.id.includes(sellerId))

    return {
        isLoading,
        isError,
        warehouses: filteredWarehouses,
    }
}

export function useWarehousesBySellerServerSide(sellerId: string) {
    const {isLoading, isError, data: warehouses} = useQuery({
        queryKey: ['warehouses', sellerId],
        queryFn: () => getWarehousesBySellerId(sellerId)
    })

    return {
        isLoading,
        isError,
        warehouses,
    }
}

export function useAccount(id: string) {
    const {isLoading, isError, data: warehouse} = useQuery({
        queryKey: ['warehouse', id],
        queryFn: () => getWarehouse(id),
    })
    return {
        isLoading,
        isError,
        warehouse,
    }
}


export function useAddAppointment(warehouseId: string) {
    const queryClient = useQueryClient()
    // the queryClient is used to invalidate the warehouse cache with key ['warehouse', warehouseId] after a new appointment is succesfully added
    // this results in a refetch of the warehouse
    // please note that this will NOT give us an updated warehouse BALANCE since json-server can not 'calculate' something!
    const {
        mutate,
        isPending,
        isError,
    } = useMutation(
        {
            mutationFn: (appointment: NewAppointment) => addAppointment(appointment),
            onSuccess: () => queryClient.invalidateQueries({queryKey: ['warehouse', warehouseId]}),
        })

    return {
        isPending,
        isError,
        addAppointment: mutate,
    }
}

