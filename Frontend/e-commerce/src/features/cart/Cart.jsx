import { Trash2, Plus, Minus } from "lucide-react";
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation } from "./cart";
import CartSummary from "./CartSummary";
import CartUpdate from "./CartUpdate";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { notifyError } from "../../utils/notify";
export default function Cart() {
    const { user, loading: userLoading } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const { data: cart, isLoading } = useGetCartQuery(undefined, { skip: !user })
    const [updateCartItem, { isLoading: isUpdating }] = useUpdateCartItemMutation()
    const [removeCartItem, { isLoading: isRemoving }] = useRemoveCartItemMutation()



    const handleQuantityIncrease = async (item, variantId, quantity) => {
        try {
            await updateCartItem({ productId: item, variantId, quantity: quantity + 1 }).unwrap()
            console.log("cart updated successfully")
        }
        catch (error) {
            (error)
        }
    }
    const handleQuantityDecrease = async (item, variantId, quantity) => {
        if (quantity <= 1) return;
        try {
            await updateCartItem({ productId: item, variantId, quantity: quantity - 1 }).unwrap()
        }
        catch (error) {
            notifyError(error?.data?.message)
        }
    }
    const handleRemoveItem = async (item, variantId) => {
        try {
            await removeCartItem({ productId: item, variantId }).unwrap()
        }
        catch (error) {
            (error)
        }
    }
    if (isLoading) {
        return <p className="text-center">Loading Cart</p>
    }


    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6 mt-8">🛒 Your Cart</h1>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {!cart?.items?.length ? <p>Your cart is empty</p> : cart?.items?.map((item) => (
                        <div
                            key={item.variantId}
                            className="bg-white p-4 rounded-2xl shadow flex flex-col sm:flex-row gap-4"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full sm:w-32 h-32 object-cover rounded-xl"
                            />


                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h2 className="font-semibold text-lg">{item?.product?.title}</h2>
                                    <p className="text-sm text-gray-500">{item.variantLabel}</p>
                                </div>

                                {/* QUANTITY + ACTIONS */}
                                <div className="flex items-center justify-between mt-4">
                                    <CartUpdate item={item} isUpdating={isUpdating} handleIncrease={handleQuantityIncrease} handleDecrease={handleQuantityDecrease} />

                                    <button className="text-red-500" onClick={() => handleRemoveItem(item.product._id, item.variantId)}>
                                        <Trash2 />
                                    </button>
                                </div>
                            </div>

                            {/* PRICE */}
                            <div className="flex flex-col justify-between items-end">
                                <p className="font-bold text-lg">
                                    ₹{item.price * item.quantity}
                                </p>
                                <p className="text-sm text-gray-500">
                                    ₹{item.price} each
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <CartSummary cart={cart} />
            </div>
        </div>
    );
}