import {Card, CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";
import {Warehouse} from "../model/Warehouse.ts";

interface SellerCardProps {
    warehouse: Warehouse;
}

export function SellerCard({warehouse}: SellerCardProps) {
    return (
        <Card sx={{width: 200}} variant="outlined">
            <CardActionArea>
                <CardMedia
                    component="img"
                    sx={{height: 180, objectFit: "cover", p: 1, objectPosition: "top"}}
                    image={warehouse.seller.profilePic}
                    alt="Seller profile picture"
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div" sx={{textAlign: 'center'}}>
                        Seller ID: {warehouse.seller.id}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
