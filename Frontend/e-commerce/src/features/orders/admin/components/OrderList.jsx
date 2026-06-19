import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, CreditCard, User } from "lucide-react";

export default function OrderList({ data = [] }) {
    const navigate = useNavigate();

    const getStatusStyles = (status) => {
        switch (status) {
            case "Pending":
                return "bg-amber-50 text-amber-700 border border-amber-200";
            case "Delivered":
                return "bg-green-50 text-green-700 border border-green-200";
            case "Cancelled":
                return "bg-red-50 text-red-700 border border-red-200";
            default:
                return "bg-gray-50 text-gray-700 border border-gray-200";
        }
    };

    return (
        <div>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Amount</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((order, index) => (
                                <tr
                                    key={order._id}
                                    className={`border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 ${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }`}
                                >
                                    <td className="px-6 py-4 text-sm">
                                        <code className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-mono text-xs">
                                            {order._id?.slice(-8)}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                        {order.user?.name || "Unknown"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                                        Rs. {order.totalPrice?.toLocaleString() || 0}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {order.paymentMethod || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyles(
                                                order.status
                                            )}`}
                                        >
                                            <span className="w-2 h-2 rounded-full mr-2 inline-block bg-current opacity-70"></span>
                                            {order.status || "Unknown"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                                        >
                                            Details
                                            <ArrowRight size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {data.map((order) => (
                    <div
                        key={order._id}
                        className="bg-white rounded-lg shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Order ID</p>
                                <code className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-mono text-xs">
                                    {order._id?.slice(-8)}
                                </code>
                            </div>
                            <span
                                className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyles(
                                    order.status
                                )}`}
                            >
                                <span className="w-2 h-2 rounded-full mr-2 inline-block bg-current opacity-70"></span>
                                {order.status || "Unknown"}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <User size={18} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Customer</p>
                                    <p className="text-sm font-medium text-gray-900">{order.user?.name || "Unknown"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <CreditCard size={18} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Total Amount</p>
                                    <p className="text-sm font-bold text-gray-900">
                                        Rs. {order.totalPrice?.toLocaleString() || 0}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar size={18} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Payment Method</p>
                                    <p className="text-sm text-gray-700">{order.paymentMethod || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                            className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium flex items-center justify-center gap-2"
                        >
                            View Details
                            <ArrowRight size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}