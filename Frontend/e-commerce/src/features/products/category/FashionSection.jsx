import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGetBannerQuery } from "../../Banners/BannerSlice";
import BannerSlot from "../../Banners/components/BannerSlot";
import FashionTab from "./Fashion/FashionTab";
import GenderPanel from "./Fashion/GenderPanel";
import EmptyState from "../../../components/common/EmptyState";
import { useNavigate } from "react-router-dom";
// ── Image Imports ──
import tshirtsImage from "../../../assets/Fashion/tshirt.webp";
import dressesImage from "../../../assets/Fashion/dresses.webp";
import jeansImage from "../../../assets/Fashion/jeans.webp";
import jacketsImage from "../../../assets/Fashion/jackets.webp";
import hoodiesImage from "../../../assets/Fashion/hoodies.webp";
import topsImage from "../../../assets/Fashion/tops.webp";
import womenJeans from "../../../assets/Fashion/womenJeans.webp";
import womenJacket from "../../../assets/Fashion/womenJacket.webp";


const CATEGORIES = {
    men: [
        { name: "t-shirts", image: tshirtsImage },
        { name: "jeans", image: jeansImage },
        { name: "jackets", image: jacketsImage },
        { name: "hoodies", image: hoodiesImage },
    ],
    women: [
        { name: "tops", image: topsImage },
        { name: "jeans", image: womenJeans },
        { name: "dresses", image: dressesImage },
        { name: "jackets", image: womenJacket },
    ],
};

export default function FashionSection() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(
        location.hash ? location.hash.replace("#", "") : "men"
    );

    // Fetch Banners
    const { data: banners, isLoading: isLoadingBanners } = useGetBannerQuery({
        type: "category",
        category: "fashion",
    });

    // Keep tab synced if user navigates via hash
    useEffect(() => {
        if (location.hash) {
            setActiveTab(location.hash.replace("#", ""));
        }
    }, [location.hash]);

    // Loading State
    if (isLoadingBanners) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="loading loading-spinner loading-lg text-slate-900" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">

            {/* ─── Hero Banner ─── */}
            <div className="w-full sm:pl-4">
                <BannerSlot placement="home_top" banners={banners} />
            </div>

            {/* ─── Tab Navigation ─── */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-100 py-4 shadow-sm">
                <FashionTab activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* ─── Content Area ─── */}
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8  py-6 md:py-8">

                <div className={activeTab === "men" ? "block" : "hidden"}>
                    <GenderPanel gender="Men" items={CATEGORIES.men} banners={banners} />
                </div>


                <div className={activeTab === "women" ? "block" : "hidden"}>
                    <GenderPanel gender="Women" items={CATEGORIES.women} banners={banners} />
                </div>

            </div>



            <EmptyState onAction={() => navigate("/products?category=clothing")} />

        </div>
    );
}