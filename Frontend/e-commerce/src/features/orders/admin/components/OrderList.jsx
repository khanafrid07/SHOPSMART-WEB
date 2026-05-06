import { useNavigate } from "react-router-dom";
export default function OrderList({ data = [] }) {
    const navigate = useNavigate();


    return (
        <div className="p-5 bg-background text-text">
            <h2 className="text-2xl font-bold mb-5">All Orders</h2>

            <div className="hidden md:block border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
                <div className="grid grid-cols-6 bg-gray-50 text-gray-700 font-semibold p-3 text-sm border-b text-center">
                    <p>Order ID</p>
                    <p>Customer</p>
                    <p>Total Amount</p>
                    <p>Payment</p>
                    <p>Status</p>
                    <p>Action</p>
                </div>

                {data.map((order) => (
                    <div
                        key={order._id}
                        className="grid grid-cols-6 place-items-center text-center p-4 text-sm border-b last:border-b-0 hover:bg-gray-50 transition"
                    >
                        <p className="text-gray-500 font-mono truncate">{order._id}</p>
                        <p className="text-gray-700">{order.user?.name || "Unknown"}</p>
                        <p className="text-gray-800 font-medium">
                            Rs. {order.totalPrice?.toLocaleString() || 0}
                        </p>
                        <p className="text-gray-600">{order.paymentMethod || "N/A"}</p>

                        <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full w-fit ${order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : order.status === "Delivered"
                                    ? "bg-green-100 text-green-700"
                                    : order.status === "Cancelled"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                        >
                            {order.status || "Unknown"}
                        </span>

                        <button
                            onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Details
                        </button>
                    </div>
                ))}
            </div>

            {/* Card layout for small screens */}
            <div className="space-y-4 md:hidden">
                {data.map((order) => (
                    <div
                        key={order._id}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col gap-2"
                    >
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-mono text-gray-500 truncate w-40">
                                #{order._id}
                            </p>
                            <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : order.status === "Delivered"
                                        ? "bg-green-100 text-green-700"
                                        : order.status === "Cancelled"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {order.status || "Unknown"}
                            </span>
                        </div>

                        <p className="text-gray-700 text-sm">
                            <span className="font-semibold">Customer:</span>{" "}
                            {order.user?.name || "Unknown"}
                        </p>

                        <p className="text-gray-700 text-sm">
                            <span className="font-semibold">Total:</span> $
                            {order.totalPrice?.toLocaleString() || 0}
                        </p>

                        <p className="text-gray-700 text-sm">
                            <span className="font-semibold">Payment:</span>{" "}
                            {order.paymentMethod || "N/A"}
                        </p>

                        <div className="flex justify-end">
                            <button
                                onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                                className="text-blue-600 hover:underline text-sm"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}