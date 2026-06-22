import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Sparkles, Zap, ArrowRight } from "lucide-react";

import Accessories from "../../assets/Accessories.webp";
import Beauty from "../../assets/Beauty.webp";
import Fashion from "../../assets/Fashion.webp";
import Footwear from "../../assets/Footwear.webp";

export default function CategorySection() {
  const navigate = useNavigate();

  const categories = [
    { img: Fashion, label: "Fashion", icon: ShoppingBag, color: "from-purple-500 to-pink-500" },
    { img: Beauty, label: "Beauty", icon: Sparkles, color: "from-pink-500 to-rose-500" },
    { img: Accessories, label: "Accessories", icon: ShoppingBag, color: "from-violet-500 to-purple-500" },
    { img: Footwear, label: "Footwear", icon: Zap, color: "from-fuchsia-500 to-pink-500" },
  ];

  return (
    <section id="category" className="w-full py-10 sm:py-14 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-8 lg:px-16">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs sm:text-sm font-medium bg-purple-100 text-purple-700 rounded-full">
            <Sparkles size={14} />
            Shop Categories
          </div>

          <h2 className="mt-3 text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Explore By Category
          </h2>

          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            Discover fashion, beauty, accessories, and footwear collections tailored for you
          </p>
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.12 },
            },
          }}
        >
          {categories.map((cat, i) => {
            const Icon = cat.icon;

            return (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 200 }}
                onClick={() => navigate(`/category/${cat.label}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") navigate(`/category/${cat.label}`);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Shop ${cat.label}`}
                className="group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
              >
                <div className="relative h-40 sm:h-56 md:h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">

                  {/* Image */}
                  <img
                    src={cat.img}
                    alt={cat.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Icon */}
                  <div className={`absolute top-3 left-3 bg-gradient-to-br ${cat.color} p-2 rounded-full shadow-md`}>
                    <Icon size={18} className="text-white" />
                  </div>

                  {/* Text */}
                  <div className="absolute bottom-0 p-3 sm:p-4 text-white">
                    <h3 className="text-sm sm:text-lg font-bold">
                      {cat.label}
                    </h3>

                    <div className="flex items-center gap-1 text-xs sm:text-sm text-white/70 mt-1 group-hover:text-white group-hover:gap-2 transition-all duration-300">
                      Explore
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}