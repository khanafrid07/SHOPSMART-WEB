import BannerData from "../../features/Banners/components/BannerData"
import useDashboardStats from "../../hooks/useDashboardStats"
import BannerFilters from "../../features/Banners/components/BannerFilter"
import { useGetBannerQuery } from "../../features/Banners/BannerSlice"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Image, Plus } from "lucide-react"
import Loader from "../../components/common/Loader"

export default function BannerManagement() {
    const { bannersCount } = useDashboardStats()
    const [filters, setFilters] = useState({
        type: "",
        status: null
    })
    const { data: banners = [], isLoading, isError } = useGetBannerQuery(filters);
    if(isLoading) return<Loader/>

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="pt-8 px-4 sm:px-6 lg:px-8 mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                            <Image size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Banners Management</h1>
                            <p className="text-gray-600 text-sm mt-1">Create and manage promotional banners</p>
                        </div>
                    </div>
                    <Link to={"create"}>
                        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg">
                            <Plus size={20} />
                            <span className="hidden sm:inline">Create Banner</span>
                            <span className="sm:hidden">Add</span>
                        </button>
                    </Link>
                </div>

                <div className="px-4 sm:px-6 lg:px-8">
                    <BannerData isError={isError} isLoading={isLoading} banners={banners} filters={filters} setFilters={setFilters} bannerCounts={bannersCount} />
                </div>
            </div>
        </div>
    )
}