import OrderItems from "./OrderItems";
import OrderSummary from "./OrderSummary";
import OrderAddress from "./OrderAddress";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderTimeline from "./OrderTimeline";
import StatusController from "../../admin/components/StatusController";

import { useOrderByIdQuery } from "../../orderSlice";
import { useParams } from "react-router-dom";

export default function OrderDetails({ isAdmin }) {
  const { id } = useParams();
  const { data: order, isLoading, isError } = useOrderByIdQuery(id);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error">Failed to load order</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6 md:p-10">

      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER CARD */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1 className="text-2xl font-bold">Order Details</h1>
              <p className="text-xs text-gray-400">{order._id}</p>
            </div>

            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {isAdmin &&
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="font-semibold mb-3">Admin Controls</h2>
              <StatusController order={order} />
            </div>
          </div>
        }

        {/* TIMELINE */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="font-semibold mb-4">Order Tracking</h2>
            <OrderTimeline status={order.status} />
          </div>
        </div>

        {/* ITEMS */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="font-semibold mb-4">Items</h2>
            <OrderItems order={order} />
          </div>
        </div>

        {/* BOTTOM GRID */}
        <div className="grid lg:grid-cols-2 gap-6">

          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="font-semibold mb-3">Shipping Address</h2>
              <OrderAddress address={order.shippingAddress} />
            </div>
          </div>

          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="font-semibold mb-3">Order Summary</h2>
              <OrderSummary order={order} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}