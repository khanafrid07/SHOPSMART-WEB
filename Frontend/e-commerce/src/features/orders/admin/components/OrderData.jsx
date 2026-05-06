import { useMemo } from "react";
import { useAdminGetOrdersQuery } from "../../orderSlice";
import ProductStats from "../../../Dashboard/shared/ProductsStats";
import { Box, PackageOpen, Truck, Vault } from "lucide-react";

export default function OrderData() {

    const { data: orders = [], isLoading, isError } = useAdminGetOrdersQuery();
    console.log(orders, "orders data")


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
                bgColor: "bg-gray-200",
                icon: <Box size={50} color="blue" />
            },
            {
                name: "Pending Orders",
                count: pending,
                bgColor: "bg-yellow-200",
                icon: <Truck size={50} color="orange" />
            },
            {
                name: "Completed Orders",
                count: delivered,
                bgColor: "bg-green-200",
                icon: <PackageOpen size={50} color="green" />
            },
            {
                name: "Cancelled Orders",
                count: cancelled,
                bgColor: "bg-red-200",
                icon: <Vault size={50} color="red" />
            }
        ];

    }, [orders]);
    if (isLoading) return <p className="p-4 text-gray-500">Loading orders...</p>;
    if (isError) return <p className="p-4 text-red-500">Failed to load orders.</p>;


    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="w-full">
                <ProductStats productStats={orderStatus} />
            </div>

        </div>
    );
}