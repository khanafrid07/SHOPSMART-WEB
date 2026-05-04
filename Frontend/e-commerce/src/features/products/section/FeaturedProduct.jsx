import { useGetProductsQuery } from "../productSlice";
import ProductCard from "../components/ProductCard";
import { ArrowRight, Loader2, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import ProductCardSkeleton from "../../../components/skeletons/productCardSkeleton";
import { motion } from "framer-motion";
export default function FeaturedProduct({ gender, category }) {
  const { isLoading, data } = useGetProductsQuery({
    sort: "featured",
    limit: 8,
    gender,
    category,
  });

  const scrollRef = useRef();
  const { allProducts = [] } = data || {};

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.clientWidth;

    scrollRef.current.scrollBy({
      left: dir === "left" ? -width : width,
      behavior: "smooth",
    });
  };



  return (
    <section className="relative py-6 overflow-hidden">


      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-purple-50/40 to-white" />
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-300/20 blur-[120px] rounded-full -z-10" />

      <div className=" sm:px-6 md:px-8 lg:px-10 sm:space-y-6">


        <div className="flex justify-between items-end">
          <div className="max-w-full">

            <div className="inline-flex items-center gap-2 md:text-5xl text-3xl font-bold tracking-wide  rounded-full ">

              Featured Collection

            </div>





            <p className="text-gray-500 mt-3 text-sm sm:text-base">
              Carefully curated styles designed to stand out this season.
            </p>
          </div>
          {isLoading && (
            <div className="flex gap-5 md:gap-6 ">
              {Array.from({ length: 8 }).map((_, i) => (
                <div className="w-full " key={i}><ProductCardSkeleton /></div>
              ))}
            </div>
          )}


        </div>
        <div className="flex items-center justify-end mb-3">
          <p className="text-xs font-semibold tracking-widest ">VIEW ALL</p>
          <ArrowRight className="transition group-hover:translate-x-1" size={16} />
        </div>

        <div className="relative group">

          <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent z-10" />

          <div
            ref={scrollRef}
            className="flex gap-5 sm:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          >
            {allProducts.length > 0 ? (
              allProducts.map((product, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={product._id}
                  className="max-w-[190px] sm:min-w-[240px] md:min-w-[260px] flex-shrink-0 snap-start transition-transform duration-300 hover:scale-[1.04]"
                >
                  <ProductCard product={product} featured />
                </motion.div>
              ))
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-14">
                <Zap className="text-purple-500 mb-3" size={36} />
                <p className="text-gray-500 text-lg">No Featured Products</p>
              </div>
            )}
          </div>

          {/* 💎 Premium Arrows */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex items-center justify-center absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-xl opacity-0 group-hover:opacity-100 transition hover:scale-110"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={() => scroll("right")}
            className="hidden md:flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-xl opacity-0 group-hover:opacity-100 transition hover:scale-110"
          >
            <ChevronRight />
          </button>
        </div>



      </div>

    </section>
  );
}