import { HeartOff } from "lucide-react"

export default function WishlistProductCard({ product, onRemove, isRemoving, onAddToCart, isAdding, variant }) {

    return (
        <div className=" flex flex-col sm:p-2 w-full">
            <div className="w-full sm:w-[12rem] md:w-[14rem] relative group">
                <img className="object-cover rounded-t-xl w-full h-[12rem] sm:h-[14rem] group-hover:scale-105 transition duration-300 cursor-pointer " src={variant?.images?.[0]?.url || product?.product?.images?.[0]?.url} />
                <button className="absolute top-2 right-2 p-2" disabled={isRemoving} onClick={() => onRemove(product.product._id, product.variantId || "null")}>
                    <div className="tooltip" data-tip="Remove">
                        <HeartOff className="w-5 h-5  " />
                    </div>
                </button>
                <div className="p-2 group-hover:scale-105 transition duration-300 cursor-pointer">
                    <h3 className="font-semibold text-xs sm:text-sm truncate">{product.product.title}</h3>
                    <p className="text-purple-600 font-bold text-xs sm:text-sm flex gap-2 sm:gap-8"><span className="text-gray-500 line-through">Rs. {Math.round(variant.price || product.product.basePrice)}</span> <span>Rs. {Math.round(variant.price - (variant.price * variant.discount / 100))}</span>

                    </p>

                </div>
                <div className="">
                    <button onClick={() => onAddToCart(product.product._id, product.variantId)} disabled={isAdding} className="btn btn-sm sm:btn-md text-xs sm:text-md bg-black w-full text-white">Add to Cart</button>
                </div>
            </div>
        </div>
    )
}