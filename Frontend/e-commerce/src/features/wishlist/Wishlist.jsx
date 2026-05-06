import { Heart } from "lucide-react";
import Loader from "../../components/common/Loader";
import { notifyError, notifySuccess } from "../../utils/notify";
import WishlistProductCard from "./components/WishlistProductCard";
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from "./wishlistSlice";
import { useAddToCartMutation } from "../cart/cart";
import EmptyState from "../../components/common/EmptyState";
import { useState } from "react";
export default function Wishlist() {
    const { data: wishlist, isLoading, isError } = useGetWishlistQuery();
    const [removeFromWishlist, { isLoading: isRemoveLoading }] = useRemoveFromWishlistMutation();
    const wishlistData = wishlist?.wishlist;
    const [addToCart, { isLoading: cartLoading }] = useAddToCartMutation();

    if (isLoading) {
        return <Loader />
    }

    const handleRemoveWishlist = async (id, variantId) => {
        try {
            await removeFromWishlist({ id, variantId }).unwrap();
            notifySuccess("Product removed from wishlist")
        } catch (error) {
            console.log(error)
            notifyError("Failed to remove product from wishlist" || error.message)
        }
    }
    const handleAddToCart = async (productId, variantId) => {
        console.log(productId, variantId, "testing")
        try {
            await addToCart({ productId, quantity: 1, variantId }).unwrap();

            notifySuccess("Product added to cart")
        } catch (error) {
            console.log(error)
            notifyError("Failed to add product to cart" || error.message)
        }
    }
    return (
        <div className="sm:p-8 p-4 min-h-screen w-full">
            <div className="flex justify-between border-b-2 p-2 sm:p-3 mt-2 sm:mt-0">
                <h1 className="font-bold text-2xl sm:text-4xl">Wishlist<span className="">({wishlistData?.[0]?.items?.length || 0})</span></h1>
                <button className="btn btn-sm sm:btn-md md-btn-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">Move All to Cart</button>

            </div>
            <div className="mt-4 gap-2 grid grid-cols-2  sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
                {wishlistData && wishlistData[0]?.items?.length > 0 ? (
                    wishlistData?.[0]?.items?.map((item) => {
                        const variant = item.product?.variants?.find((v) => v._id === item.variantId);
                        return (
                            <WishlistProductCard
                                variant={variant}
                                key={item._id}
                                isRemoving={isRemoveLoading}
                                isAdding={cartLoading}
                                product={item}
                                onRemove={handleRemoveWishlist}
                                onAddToCart={handleAddToCart}
                            />
                        )
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center col-span-full py-10">
                        <h1 className="text-2xl font-bold mb-4">Wishlist is empty</h1>
                        <Heart size={50} className="text-red-500 mb-6" />
                        <EmptyState />
                    </div>
                )}
            </div>
        </div>
    )
}