import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../features/products/productSlice";
import { useNavigate } from "react-router-dom";
import { Package, Trash2, Edit3, Package2, AlertCircle, CheckCircle2, Search, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import useDashboardStats from "../../hooks/useDashboardStats";
import { notifyError, notifySuccess } from "../../utils/notify";

/* ---------- HELPERS ---------- */
const getTotalStock = (product) => {
  if (!product.variants?.length) return product.stock || 0;
  return product.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
};

const getStockStatus = (stock) => {
  if (stock === 0)
    return { label: "Out of Stock", className: "bg-red-50 text-red-700 border border-red-200", icon: AlertCircle };
  if (stock < 10)
    return { label: `Low Stock (${stock})`, className: "bg-amber-50 text-amber-700 border border-amber-200", icon: AlertCircle };
  return { label: `In Stock (${stock})`, className: "bg-green-50 text-green-700 border border-green-200", icon: CheckCircle2 };
};

export default function ManageProducts() {
  const { data, isLoading, error } = useGetProductsQuery();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
  const navigate = useNavigate();
  const { totalProduct } = useDashboardStats();

  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");


  const { filteredProducts, stats } = useMemo(() => {
    const products = data?.allProducts || [];

    let out = 0,
      low = 0,
      inS = 0;

    const enriched = products.map((p) => {
      const totalStock = getTotalStock(p);

      if (totalStock === 0) out++;
      else if (totalStock < 10) low++;
      else inS++;

      return { ...p, totalStock };
    });

    let filtered = enriched;

    if (stockFilter !== "all") {
      filtered = filtered.filter((p) => {
        if (stockFilter === "out") return p.totalStock === 0;
        if (stockFilter === "low") return p.totalStock > 0 && p.totalStock < 10;
        if (stockFilter === "in") return p.totalStock >= 10;
        return true;
      });
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(term) ||
        (Array.isArray(p.description)
          ? p.description.join(" ").toLowerCase().includes(term)
          : p.description?.toLowerCase()?.includes(term))
      );
    }

    return {
      filteredProducts: filtered,
      stats: { outOfStock: out, lowStock: low, inStock: inS },
    };
  }, [data, stockFilter, searchTerm]);

  /* ---------- STATS ---------- */
  const productDetail = [
    {
      name: "Total Products",
      count: totalProduct || 0,
      icon: Package,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      name: "Out of Stock",
      count: stats.outOfStock,
      icon: AlertCircle,
      gradient: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      name: "In Stock",
      count: stats.inStock,
      icon: CheckCircle2,
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      name: "Low Stock",
      count: stats.lowStock,
      icon: AlertCircle,
      gradient: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    },
  ];


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteProduct(id).unwrap();
      notifySuccess("Product deleted");
    } catch {
      notifyError("Delete failed");
    }
  };

  /* ---------- STATES ---------- */
  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle size={48} className="text-red-600 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">Error loading products</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="pt-8 px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Package size={24} className="text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Products Management</h1>
          </div>
          <p className="text-gray-600 mt-2 ml-11">Add, edit, and manage your product inventory</p>
        </div>

        {/* Stats Section */}
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productDetail.map((stat) => {
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

        {/* Filter Section */}
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Search size={20} className="text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Filter Products</h3>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Stock Filter */}
              <div className="md:w-48">
                <div className="relative group">
                  <button className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 flex items-center justify-between hover:border-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <span>{stockFilter === "all" ? "All Stock" : stockFilter === "out" ? "Out of Stock" : stockFilter === "low" ? "Low Stock" : "In Stock"}</span>
                    <ChevronDown size={18} className="group-hover:rotate-180 transition" />
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    {[
                      { label: "All", value: "all" },
                      { label: "Out of Stock", value: "out" },
                      { label: "Low Stock", value: "low" },
                      { label: "In Stock", value: "in" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setStockFilter(option.value)}
                        className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition ${
                          stockFilter === option.value
                            ? "bg-blue-100 text-blue-600 font-semibold"
                            : "text-gray-700"
                        } first:rounded-t-lg last:rounded-b-lg`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredProducts.length === 0 ? (
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-100">
              <Package size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No products found</p>
            </div>
          </div>
        ) : (
          <div className="px-4 sm:px-6 lg:px-8">
            {/* DESKTOP TABLE */}
            <div className="hidden lg:block bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Stock Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p, index) => {
                      const status = getStockStatus(p.totalStock);
                      const StatusIcon = status.icon;

                      return (
                        <tr
                          key={p._id}
                          className={`border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <img
                              src={p.images?.[0]?.url}
                              alt={p.title}
                              className="w-14 h-14 object-cover rounded-lg shadow-sm"
                            />
                          </td>

                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">{p.title}</p>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full ${status.className}`}>
                              <StatusIcon size={16} />
                              {status.label}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() =>
                                  navigate(`/dashboard/update-product/${p._id}`)
                                }
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                              >
                                <Edit3 size={16} />
                                Edit
                              </button>

                              <button
                                disabled={deleting}
                                onClick={() => handleDelete(p._id)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="lg:hidden space-y-4">
              {filteredProducts.map((p) => {
                const status = getStockStatus(p.totalStock);
                const StatusIcon = status.icon;

                return (
                  <div
                    key={p._id}
                    className="bg-white rounded-lg shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex gap-4 mb-4">
                      <img
                        src={p.images?.[0]?.url}
                        alt={p.title}
                        className="w-20 h-20 rounded-lg object-cover shadow-sm"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{p.title}</h3>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${status.className}`}>
                          <StatusIcon size={14} />
                          {status.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/update-product/${p._id}`)
                        }
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium text-sm"
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>

                      <button
                        disabled={deleting}
                        onClick={() => handleDelete(p._id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium text-sm disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}