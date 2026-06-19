import { useMemo, useState } from "react"
import OrderData from "../../features/orders/admin/components/OrderData"
import OrderFilter from "../../features/orders/admin/components/OrderFilter"
import OrderList from "../../features/orders/admin/components/OrderList"
import { useAdminGetOrdersQuery } from "../../features/orders/orderSlice"
import { Package } from "lucide-react"
import Loader from "../../components/common/Loader"

export default function AdminOrder() {

  const { data = [], isLoading, isError } = useAdminGetOrdersQuery()
  const [filterStatus, setFilterStatus] = useState("All")

  const filteredData = useMemo(() => {
    if (filterStatus === "All") return data
    return data.filter(order =>
      order.status?.toLowerCase() === filterStatus.toLowerCase()
    )
  }, [filterStatus, data])
  if(isLoading) return <Loader/>

  if (isError) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-red-600 font-semibold">Error loading orders</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="pt-8 px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Package size={24} className="text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Orders Management</h1>
          </div>
          <p className="text-gray-600 mt-2 ml-11">Track and manage all customer orders</p>
        </div>

        {/* Stats Section */}
        {!isLoading && <OrderData isLoading={isLoading} />}

        {/* Filter and Content Section */}
        <div className="px-4 sm:px-6 lg:px-8">
          <OrderFilter onStatusChange={setFilterStatus} />
          
          {/* Orders List */}
          {isLoading ? (
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading orders...</p>
                  </div>
                </div>
              </div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="mt-8 bg-white rounded-lg shadow-md p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <Package size={48} className="text-gray-300" />
                <p className="text-gray-500 text-lg font-medium">No orders found</p>
              </div>
            </div>
          ) : (
            <OrderList data={filteredData} />
          )}
        </div>
      </div>
    </div>
  )
}