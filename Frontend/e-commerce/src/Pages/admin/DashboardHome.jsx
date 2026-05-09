import { HandCoins, ShoppingCart, User, Package, TrendingUp, Clock, CheckCircle } from "lucide-react";
import useDashboardStats from "../../hooks/useDashboardStats";
import { useNavigate } from "react-router-dom";
export default function DashboardHome() {
  const { recentOrders, revenue30days, totalOrders, totalCustomer, pendingDelivery, topProducts, isError, isLoading } = useDashboardStats()
  const navigate = useNavigate()


  const dashboardStats = [
    {
      name: "Total Revenue",
      icon: HandCoins,
      number: `Rs.${revenue30days}`,
      change: "+12.5%",
      bgGradient: "from-blue-500/10 to-blue-600/10",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      name: "Total Orders",
      icon: ShoppingCart,
      number: `${totalOrders}`,
      change: "+8.2%",
      bgGradient: "from-green-500/10 to-green-600/10",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      name: "Total Customers",
      icon: User,
      number: `${totalCustomer}`,
      change: "+5.4%",
      bgGradient: "from-purple-500/10 to-purple-600/10",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      name: "Pending Delivery",
      icon: Package,
      number: `${pendingDelivery}`,
      change: "-2.3%",
      bgGradient: "from-orange-500/10 to-orange-600/10",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];




  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Welcome back! Here's your business performance at a glance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-2 sm:mb-4">
        {dashboardStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.bgGradient} border border-gray-200 rounded-xl p-2 sm:p-4 hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
                    {stat.name}
                  </p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                  <p className="text-lg sm:text-3xl mt-5 font-bold text-gray-900">
                    {stat.number}
                  </p>
                </div>
                <div className={`${stat.iconBg} p-3 rounded-lg`}>
                  <Icon className={`${stat.iconColor} w-5 h-5`} />
                </div>
              </div>

              <div className="flex items-center gap-2 sm:pt-4 border-t border-gray-200">
                <TrendingUp
                  className={`w-4 h-4 ${stat.change.startsWith("+")
                    ? "text-green-600"
                    : "text-red-600"
                    }`}
                />
                <span
                  className={`text-xs font-semibold ${stat.change.startsWith("+")
                    ? "text-green-600"
                    : "text-red-600"
                    }`}
                >
                  {stat.change} vs last month
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Recent Orders
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders?.map((order, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">
                        {order._id.slice(0, 8)}...
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                        {order?.user?.name}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">
                        Rs. {order.totalPrice}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${order.status == "Pending" ? "bg-yellow-400" : order.status == "Cancelled" ? "bg-red-400" : "bg-green-400"}`}
                        >
                          <CheckCircle className="w-3 h-3" />
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={() => navigate("/dashboard/orders")} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
                View All Orders →
              </button>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Top Products
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {topProducts?.map((product, idx) => (
              <div key={idx} className="p-4 sm:p-5 hover:bg-gray-50 transition-colors duration-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  {product?.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    {product?.soldCount} sales
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    Rs. {product.basePrice ? product.basePrice * product.soldCount : 0}
                  </span>
                </div>
                <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${(product.sales / 412) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50">
            <button className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition">
              See More →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "New Product", link: "/dashboard/add-product", color: "from-blue-500 to-blue-600" },

          { label: "Manage Products", link: "/dashboard/manage-products", color: "from-purple-500 to-purple-600" },

        ].map((action, idx) => (
          <button
            onClick={() => navigate(action.link)}
            key={idx}
            className={`bg-gradient-to-r ${action.color} hover:shadow-lg text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 text-sm sm:text-base`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}