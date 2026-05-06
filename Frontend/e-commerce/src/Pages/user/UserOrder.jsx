import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../features/orders/orderSlice";
import { Package, MapPin, CreditCard } from "lucide-react";

const TABS = ["all", "pending", "shipped", "delivered", "cancelled"];

export default function UserOrder() {
  const { data: orders, isLoading, isError } = useGetMyOrdersQuery();
  const [activeTab, setActiveTab] = useState("all");

  if (isLoading) {
    return <p className="text-center p-10 text-gray-500">Loading orders...</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500 p-10">Failed to load orders</p>;
  }

  if (!orders?.length) {
    return (
      <div className="text-center p-16 text-gray-500">
        <Package size={40} className="mx-auto mb-3 opacity-40" />
        <p>No orders found</p>
      </div>
    );
  }


  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((o) => o.status === activeTab);

  const statusStyles = {
    delivered: "bg-green-100 text-green-600",
    shipped: "bg-blue-100 text-blue-600",
    cancelled: "bg-red-100 text-red-600",
    pending: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto py-10 px-4">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500">Manage your purchases</p>
        </div>


        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition
                ${activeTab === tab
                  ? "bg-black text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders */}
        <div className="space-y-8">
          {filteredOrders.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              No {activeTab} orders found
            </p>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition"
              >
                {/* Top */}
                <div className="flex justify-between items-center p-5 border-b">
                  <div>
                    <p className="text-xs text-gray-400">Order ID</p>
                    <p className="font-medium">{order._id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusStyles[order.status]
                      }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="p-5 space-y-3">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
                    >
                      <img
                        src={item.image}
                        className="w-16 h-16 object-cover rounded"
                      />

                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.variantLabel}
                        </p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bottom */}
                <div className="p-5 border-t grid md:grid-cols-2 gap-4">
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state}
                    </div>

                    <div className="flex items-center gap-2">
                      <CreditCard size={16} />
                      {order.paymentMethod}
                    </div>

                    <Link to={`/orders/${order._id}`}>
                      <button className="mt-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                        View Details →
                      </button>
                    </Link>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{order.totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Shipping</span>
                      <span>₹{order.shipping}</span>
                    </div>
                    <div className="flex justify-between text-red-500">
                      <span>Discount</span>
                      <span>-₹{order.discount}</span>
                    </div>

                    <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{order.totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}