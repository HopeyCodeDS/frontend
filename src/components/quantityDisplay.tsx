import {Stack, Typography} from "@mui/material";

interface QuantityDisplayProps {
    quantity: number
    measurement: string
}

export function QuantityDisplay({quantity, measurement}: QuantityDisplayProps) {
    return (
        <Stack direction="row" sx={{alignItems: 'center'}}>
            <Typography variant="h4" sx={{color: 'text.primary'}}>
                {quantity}
            </Typography>
            <Typography variant="h6" sx={{color: 'text.secondary'}}>
                {measurement}
            </Typography>
        </Stack>
    )
}