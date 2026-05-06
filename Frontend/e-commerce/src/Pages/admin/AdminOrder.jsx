import { useMemo, useState } from "react"
import OrderData from "../../features/orders/admin/components/OrderData"
import OrderFilter from "../../features/orders/admin/components/OrderFilter"
import OrderList from "../../features/orders/admin/components/OrderList"
import { useAdminGetOrdersQuery } from "../../features/orders/orderSlice"

export default function AdminOrder() {

  const { data = [], isLoading, isError } = useAdminGetOrdersQuery()
  const [filterStatus, setFilterStatus] = useState("All")


  const filteredData = useMemo(() => {

    if (filterStatus === "All") return data

    return data.filter(order =>
      order.status?.toLowerCase() === filterStatus.toLowerCase()
    )

  }, [filterStatus, data])

  if (isLoading) return <p>Orders are Loading...</p>
  if (isError) return <p>Error loading orders</p>

  return (
    <div className="min-h-screen">

      <OrderData />

      <OrderFilter onStatusChange={setFilterStatus} />

      {filteredData.length === 0
        ? <p className="text-center p-4">No orders found</p>
        : <OrderList data={filteredData} />
      }

    </div>
  )
}