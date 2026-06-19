import { Search, ChevronDown, Filter } from "lucide-react";
import { useState } from "react";

export default function OrderFilter({ onSearch, onStatusChange }) {

    const [selectedStatus, setSelectedStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const handleStatusClick = (status) => {
        setSelectedStatus(status);
        if (onStatusChange) onStatusChange(status);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (onSearch) onSearch(e.target.value);
    };

    const OrderStatus = [
        { label: "All", value: "All" },
        { label: "Pending", value: "Pending" },
        { label: "Delivered", value: "Delivered" },
        { label: "Cancelled", value: "Cancelled" }
    ];

    return (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
                <Filter size={20} className="text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">Filter Orders</h3>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by order ID or customer name..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                </div>

                {/* Status Filter */}
                <div className="md:w-48">
                    <div className="relative group">
                        <button className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 flex items-center justify-between hover:border-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <span>{selectedStatus}</span>
                            <ChevronDown size={18} className="group-hover:rotate-180 transition" />
                        </button>
                        
                        <div className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                            {OrderStatus.map((status) => (
                                <button
                                    key={status.value}
                                    onClick={() => handleStatusClick(status.value)}
                                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition ${
                                        selectedStatus === status.value
                                            ? "bg-blue-100 text-blue-600 font-semibold"
                                            : "text-gray-700"
                                    } first:rounded-t-lg last:rounded-b-lg`}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}