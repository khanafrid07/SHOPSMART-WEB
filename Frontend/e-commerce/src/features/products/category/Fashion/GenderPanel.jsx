import { memo } from "react";
import { ShoppingBag } from "lucide-react";
import CategoryCard from "./CategoryCard";
import TrendingProducts from "../../section/TrendingProducts";
import FeaturedProduct from "../../section/FeaturedProduct";
import BannerSlot from "../../../Banners/components/BannerSlot";

// Memoized panel to prevent re-rendering when switching tabs
const GenderPanel = memo(({ gender, items, banners }) => {
  return (
    <div className="animate-fade-in space-y-8 w-full">

      {/* ─── Header Section ─── */}
      <div id={gender.toLowerCase()} className="flex items-center gap-4">
        <div className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-lg flex items-center justify-center">
          <ShoppingBag className="w-6 h-6" strokeWidth={2} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-1">
            Explore Collection
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {gender}'s Fashion
          </h2>
        </div>
      </div>


      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <CategoryCard key={item.name} item={item} gender={gender} />
        ))}
      </div>





      <div className="w-full border-t border-slate-100">
        <FeaturedProduct gender={gender} category="Clothing" />
        <div className="w-full sm:p-8 mb-6">
          <BannerSlot placement="home_bottom" banners={banners} />
        </div>
        <TrendingProducts gender={gender} category="Clothing" />
      </div>

    </div>
  );
});

export default GenderPanel;
