import {Seller} from "../model/Seller.ts";

interface SellerBadgeProps {
    seller: Seller
    onClick: () => void
}

export function OwnerBadge({seller, onClick}: SellerBadgeProps) {
    return (
        <div className="seller-badge" onClick={onClick}>
            <img src={seller.profilePic} alt={seller.id}/>
        </div>
    )
}