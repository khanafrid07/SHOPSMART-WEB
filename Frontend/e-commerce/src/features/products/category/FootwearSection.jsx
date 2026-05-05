import { useNavigate } from "react-router-dom";
import { Footprints, Mountain, Briefcase, Flame, ArrowRight, Zap, Sparkles } from "lucide-react";

import TrendingProducts from "../section/TrendingProducts";
import BannerSlot from "../../Banners/components/BannerSlot";
import { motion } from "framer-motion";
import { useGetBannerQuery } from "../../Banners/BannerSlice";
import NewArrivals from "../section/NewArrivals";
import EmptyState from "../../../components/common/EmptyState";

export default function FootwearSection() {
  const navigate = useNavigate();
  const { data: bannerData, isLoading: bannerLoading } = useGetBannerQuery({ type: "category", category: "footwear" });

  const footwear = {
    men: [
      {
        label: "Sneakers",
        icon: <Footprints size={32} />,
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=900",
        type: "sneakers",
        description: "Comfortable & stylish everyday wear",
      },
      {
        label: "Boots",
        icon: <Mountain size={32} />,
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=900",
        type: "boots",
        description: "Rugged durability for any terrain",
      },
      {
        label: "Formal Shoes",
        icon: <Briefcase size={32} />,
        image: "https://images.unsplash.com/photo-1584735175097-719d848f8449?w=900",
        type: "formal shoes",
        description: "Professional elegance and class",
      },
    ],
    women: [
      {
        label: "Sandals",
        icon: <Flame size={32} />,
        image: "https://images.unsplash.com/photo-1600180758895-3f69c78f1f84?w=900",
        type: "sandals",
        description: "Breezy summer vibes & comfort",
      },
      {
        label: "Heels & Boots",
        icon: <Mountain size={32} />,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900",
        type: "boots",
        description: "Bold, confident, and stunning",
      },
      {
        label: "Sneakers",
        icon: <Footprints size={32} />,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900",
        type: "sneakers",
        description: "Trendy everyday essentials",
      },
    ],
  };

  const renderCards = (items, gender) =>
    items.map((item, index) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: index * 0.12, duration: 0.6, ease: "easeOut" }}
        key={`${gender}-${item.type}`}
        onClick={() => navigate(`/products?category=footwear&gender=${gender}&type=${item.type}`)}
        className="group relative h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-white"
      >
        {/* Background Image with Blur effect */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.label}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {/* Multi-layer overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-900/50 to-transparent opacity-75 group-hover:opacity-85 transition-opacity duration-500" />
          <div className="absolute inset-0 backdrop-blur-0 group-hover:backdrop-blur-[2px] transition-all duration-500" />
        </div>

        {/* Floating Animated Badge */}
        <div className="absolute top-5 right-5 p-3 rounded-full bg-white/25 backdrop-blur-xl border border-white/40 text-white group-hover:bg-white/35 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-125 shadow-xl">
          <motion.div whileHover={{ rotate: 20 }} transition={{ duration: 0.3 }}>
            {item.icon}
          </motion.div>
        </div>

        {/* Accent line */}
        <div className="absolute top-0 left-0 w-20 h-1 bg-gradient-to-r from-amber-400 to-transparent group-hover:w-32 transition-all duration-500" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-7 text-white text-left">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 group-hover:-translate-y-2 transition-transform duration-500 tracking-tight">
              {item.label}
            </h3>
            <p className="text-xs sm:text-sm text-white/85 mb-6 group-hover:text-white transition-colors duration-500 line-clamp-2 font-medium">
              {item.description}
            </p>

            {/* Premium Shop Button */}
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-white group-hover:text-amber-300 transition-colors duration-300 w-fit group-hover:gap-3"
            >
              <span>Shop Now</span>
              <motion.div
                className="bg-white/20 p-1.5 rounded-full"
                whileHover={{ rotate: 45 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight size={16} />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>

        {/* Corner decoration */}
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-white/10 to-transparent rounded-tl-2xl group-hover:w-20 group-hover:h-20 transition-all duration-500" />
      </motion.div>
    ));

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen pb-20">
      {/* ── TOP BANNER ── */}
      {bannerData && bannerData.length > 0 && (
        <div className="max-w-full mx-auto sm:pl-4">
          <BannerSlot placement={"home_top"} banners={bannerData} rounded={true} />
        </div>
      )}

      <div className="max-w-full mx-auto sm:pl-4  mt-4 sm:mt-12 md:mt-16">

        {/* ── Trending Section ── */}
        <section className="mb-24 px-4 sm:px-0">
          <TrendingProducts category={"footwear"} />
        </section>

        {/* ── MEN'S COLLECTION ── */}
        <section className="mb-28 px-4 sm:px-12">
          <div className="flex items-center gap-3 mb-12 md:mb-16">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3.5 sm:p-4 rounded-2xl shadow-lg">
              <Footprints className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-widest">Premium Collection</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 mt-1">
                Men's Footwear
              </h2>
            </div>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 hidden md:block" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {renderCards(footwear.men, "men")}
          </div>
        </section>
        <div className="px-4">
          <NewArrivals category={"footwear"} />
        </div>


        {/* ── WOMEN'S COLLECTION ── */}
        <section className="mb-20 px-4 sm:px-12">
          <div className="flex items-center gap-3 mb-12 md:mb-16">
            <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-3.5 sm:p-4 rounded-2xl shadow-lg">
              <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-widest">Exclusive Range</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 mt-1">
                Women's Footwear
              </h2>
            </div>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-rose-600 hidden md:block" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {renderCards(footwear.women, "women")}
          </div>
          <EmptyState />
        </section>

      </div>
    </div>
  );
}
