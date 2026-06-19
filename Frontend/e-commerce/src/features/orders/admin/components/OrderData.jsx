import { useMemo } from "react";
import { useAdminGetOrdersQuery } from "../../orderSlice";
import { ShoppingCart, Clock, CheckCircle, XCircle } from "lucide-react";

export default function OrderData() {

    const { data: orders = [], isLoading, isError } = useAdminGetOrdersQuery();

    const orderStatus = useMemo(() => {
        let pending = 0;
        let delivered = 0;
        let cancelled = 0;

        orders.forEach(order => {
            const status = order.status?.toLowerCase();
            if (status === "pending") pending++;
            else if (status === "delivered") delivered++;
            else if (status === "cancelled") cancelled++;
        });

        return [
            {
                name: "Total Orders",
                count: orders.length,
                icon: ShoppingCart,
                gradient: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50",
                iconColor: "text-blue-600"
            },
            {
                name: "Pending Orders",
                count: pending,
                icon: Clock,
                gradient: "from-amber-500 to-orange-600",
                bgColor: "bg-amber-50",
                iconColor: "text-amber-600"
            },
            {
                name: "Completed Orders",
                count: delivered,
                icon: CheckCircle,
                gradient: "from-green-500 to-emerald-600",
                bgColor: "bg-green-50",
                iconColor: "text-green-600"
            },
            {
                name: "Cancelled Orders",
                count: cancelled,
                icon: XCircle,
                gradient: "from-red-500 to-red-600",
                bgColor: "bg-red-50",
                iconColor: "text-red-600"
            }
        ];
    }, [orders]);

    if (isError) return <div className="p-6 bg-white rounded-lg shadow-md text-red-600">Failed to load orders.</div>;

    return (
        <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {orderStatus.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.name}
                            className={`${stat.bgColor} rounded-lg p-6 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-default`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-gray-600 text-sm font-medium mb-2">{stat.name}</p>
                                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900">{stat.count}</h3>
                                </div>
                                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                                    <Icon size={28} className="text-white" />
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200/50">
                                <p className="text-xs text-gray-500">Last updated: Today</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}