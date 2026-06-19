import { X } from "lucide-react";

export default function BannerFilters({ filters, setFilters }) {
  const types = ["all", "promo", "hero", "category"];
  const statuses = ["all", "active", "inactive"];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 space-y-6">
      {/* Type Filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Banner Type</h3>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => {
            const isActive = (filters.type || "all") === type;

            return (
              <button
                key={type}
                onClick={() =>
                  setFilters({
                    ...filters,
                    type: type === "all" ? "" : type,
                  })
                }
                className={`px-4 py-2 text-sm rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Status</h3>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => {
            const isActive = (filters.status || "all") === status;

            return (
              <button
                key={status}
                onClick={() =>
                  setFilters({
                    ...filters,
                    status: status === "all" ? "" : status,
                  })
                }
                className={`px-4 py-2 text-sm rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear Filters */}
      {(filters.type || filters.status) && (
        <button
          onClick={() => setFilters({ type: "", status: "" })}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <X size={16} />
          Clear All Filters
        </button>
      )}
    </div>
  );
}