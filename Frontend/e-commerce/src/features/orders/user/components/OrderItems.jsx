import { useCancelOrderItemMutation } from "../../orderSlice";
import { notifyError, notifySuccess } from "../../../../utils/notify";
import { useNavigate } from "react-router-dom";
export default function OrderItems({ order }) {
    const [cancelOrderItem, { isLoading }] = useCancelOrderItemMutation()
    const navigate = useNavigate()

    const handleCancel = async (orderId, productId, variantId) => {
        try {
            await cancelOrderItem({ orderId, productId, variantId }).unwrap()
            notifySuccess("Item cancelled successfully")
            navigate("/orders")
        }
        catch (err) {
            (err)
            notifyError("error cancelling item")
        }
    }
    return (
        <div className="space-y-4">
            {order?.items.map((item, index) => (
                <div
                    key={index}
                    className="flex gap-4 items-center border rounded-xl p-3 hover:shadow-sm transition"
                >
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.variantLabel}</p>
                        <p className="text-sm">Qty: {item.quantity}</p>
                    </div>

                    <p className="font-semibold text-gray-700">
                        ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                        disabled={order.status === "cancelled" || order.status === "delivered" || order.status === "shipped"}
                        onClick={() => handleCancel(order._id, item.product._id, item.variantId)}
                        className={`btn  ${order.status === "cancelled" || order.status === "delivered" || order.status === "shipped" ? "btn-disabled" : "btn-error"
                            }`}
                    >
                        {isLoading ? "Cancelling..." : "Cancel"}
                    </button>
                </div>
            ))}
        </div>
    );
}