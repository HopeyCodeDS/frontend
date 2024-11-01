import {Link} from "react-router-dom";
import {SellerCard} from "./SellerCard.tsx"; // Replace with your actual SellerCard path
import {Box, Stack, TextField} from "@mui/material";
import {useState} from "react";
import {useWarehousesBySellerClientSide} from "../hooks/useWarehouses.ts";

export function WarehouseList() {
    const [sellerFilter, setSellerFilter] = useState<string>('');
    const {warehouses, isLoading, isError} = useWarehousesBySellerClientSide(sellerFilter);
    // const { warehouses, isLoading, isError } = useWarehousesBySellerServerSide(sellerFilter);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !warehouses) {
        return <div>Error loading warehouses!</div>;
    }

    return (
        <Stack sx={{alignItems: 'center', mt: 5}}>
            <TextField
                value={sellerFilter}
                sx={{width: '50%'}}
                onChange={(e) => setSellerFilter(e.target.value)}
                label="Filter by Seller ID"
            />
            <Box
                sx={{
                    mt: 5,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 2
                }}
            >
                {warehouses.map(
                    (warehouse) => (
                        <Link to={`/warehouses/${warehouse.id}`} key={warehouse.id} style={{textDecoration: 'none'}}>
                            <SellerCard warehouse={warehouse}/>
                        </Link>
                    )
                )}
            </Box>
        </Stack>
    );
}
