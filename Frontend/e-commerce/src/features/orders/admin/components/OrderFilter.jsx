import { Search, ChevronDown, ListTodo } from "lucide-react";


import SearchInput from "../../../Dashboard/shared/SearchInput";
import FilterDropdown from "../../../Dashboard/shared/FilterDropdown";

export default function OrderFilter({ onSearch, onStatusChange }) {

    const handleStatusClick = (status) => {
        if (onStatusChange) onStatusChange(status);
    };

    const handleSearchChange = (e) => {
        setQuery(e.target.value);
        if (onSearch) onSearch(e.target.value);
    };

    const OrderStatus = [
        { label: "All", value: "", className: "" },
        { label: "Pending", value: "Pending", className: "text-warning" },
        { label: "Delivered", value: 'Delivered', className: "text-success" },
        { label: "Cancelled", value: "Cancelled", className: "text-red-500" }
    ]

    return (
        <div className="flex flex-wrap items-center gap-3 w-full">

            <div className="relative w-full max-w-md flex-1">
                <SearchInput />
            </div>

            <div className="relative">
                <FilterDropdown options={OrderStatus} onSelect={handleStatusClick} label="All Status" />
            </div>



        </div>
    );
}