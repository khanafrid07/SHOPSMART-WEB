import BannerFilters from "./BannerFilter";
import { Pencil, Trash2, AlertCircle, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BannerData({
  bannerCounts = {},
  isLoading,
  isError,
  banners = [],
  filters,
  setFilters,
}) {
  const navigate = useNavigate()
  
  const getStatColor = (key) => {
    const colors = {
      active: "from-green-500 to-green-600 bg-green-50",
      inactive: "from-gray-500 to-gray-600 bg-gray-50",
      hero: "from-blue-500 to-blue-600 bg-blue-50",
      promo: "from-purple-500 to-purple-600 bg-purple-50",
      category: "from-pink-500 to-pink-600 bg-pink-50"
    };
    return colors[key] || "from-indigo-500 to-indigo-600 bg-indigo-50";
  };

  return (
    <div className="space-y-8">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(bannerCounts).map(([key, val]) => {
          const colors = getStatColor(key);
          return (
            <div
              key={key}
              className={`bg-white rounded-lg p-6 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-default ${colors.split(' ')[0] === 'from-green-500' ? 'bg-green-50' : colors.split(' ')[0] === 'from-purple-500' ? 'bg-purple-50' : colors.split(' ')[0] === 'from-blue-500' ? 'bg-blue-50' : 'bg-gray-50'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-medium mb-2 capitalize">{key} Banners</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{val}</h2>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${colors.split(' ').slice(0, 2).join(' ')}`}>
                  <Image size={28} className="text-white" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200/50">
                <p className="text-xs text-gray-500">Last updated: Today</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Section */}
      <BannerFilters filters={filters} setFilters={setFilters} />


      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-md p-12 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading banners...</p>
        </div>
      )}
      
      {/* Error State */}
      {isError && (
        <div className="bg-white rounded-lg shadow-md p-12 flex flex-col items-center justify-center gap-4">
          <AlertCircle size={48} className="text-red-600" />
          <p className="text-red-600 font-semibold">Failed to load banners</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && banners.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-100">
          <Image size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No banners found</p>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {banners.map((banner) => (
          <div
            key={banner._id}
            className="bg-white rounded-lg shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300"
          >
            {/* Top */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={banner?.image?.url}
                alt={banner.title}
                className="w-16 h-12 object-cover rounded-lg shadow-sm"
              />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">
                  {banner.title || "Untitled"}
                </h3>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {banner.placement?.replace("_", " ")}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-gray-600 pb-4 border-b border-gray-200">
              <span className="font-medium"><span className="text-gray-500">Type:</span> {banner.type}</span>
              <span className="font-medium"><span className="text-gray-500">Template:</span> {banner.template}</span>
              <span className="font-medium col-span-2"><span className="text-gray-500">Category:</span> {banner.category || "-"}</span>
            </div>

            {/* Status + Actions */}
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                  banner.isActive
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-gray-50 text-gray-700 border border-gray-200"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                {banner.isActive ? "Active" : "Inactive"}
              </span>

              <div className="flex gap-2">
                <button onClick={() => navigate(`${banner._id}/edit`)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600">
                  <Pencil size={16} />
                </button>
                <button className="p-2 rounded-lg hover:bg-red-50 text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Placement</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Template</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner, index) => (
                <tr
                  key={banner._id}
                  className={`border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{banner.title || "Untitled"}</td>
                  <td className="px-6 py-4">
                    <img
                      src={banner?.image?.url}
                      alt={banner.title}
                      className="w-14 h-10 object-cover rounded-lg shadow-sm"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 capitalize">
                    {banner.placement?.replace("_", " ")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 capitalize">{banner.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{banner.template}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{banner.category || "-"}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                        banner.isActive
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-gray-50 text-gray-700 border border-gray-200"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full mr-2 inline-block bg-current opacity-70"></span>
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => navigate(`${banner._id}/edit`)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm">
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}