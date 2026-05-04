import { useGetProductsQuery } from "../productSlice";
import LandingCard from "../components/LandingCard";
import { ArrowRight, Zap, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCardSkeleton from "../../../components/skeletons/productCardSkeleton";


export default function TrendingProducts({ category, gender }) {

  const navigate = useNavigate()

  const [limit, setLimit] = useState(
    window.innerWidth < 768 ? 6 : 8
  );
  const { isLoading, isError, data, refetch } = useGetProductsQuery({
    sort: "trending",
    limit: limit,
    category,
    gender
  });


  useEffect(() => {
    const handleResize = () => {
      const newLimit = window.innerWidth < 768 ? 4 : 8;


      setLimit(prev => (prev !== newLimit ? newLimit : prev));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);




  const { allProducts = [] } = data || {};

  return (
    <section className="relative  sm:px-6 md:px-8 lg:px-10 w-full max-w-full overflow-hidden">
      <div className="flex flex-row sm:flex-col md:flex-row md:items-end justify-between mb-4 md:mb-14 gap-2">
        <div>
          <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl  tracking-tight text-base-content  sm:mb-4">
            Most Popular
          </h2>
          <p className="text-base-content/60 text-sm sm:text-xl font-light">
            The pieces everyone is talking about.
          </p>
        </div>
        <div className="flex justify-end items-end">
          <button onClick={() => navigate(`/products?sort=trending${gender ? '&gender=' + gender : ''}${category ? '&category=' + category : ''}`)} className="text-xs  sm:text-sm font-semibold uppercase tracking-widest text-base-content hover:text-primary transition-colors flex items-center gap-2 group w-fit">
            View All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

        </div>
      </div>
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
          {Array.from({ length: limit }).map((_, i) => (
            <div className="w-full" key={i}><ProductCardSkeleton /></div>
          ))}
        </div>
      )}


      <div className="bg-white ">
        <div className=" ">
          <motion.div
            className="overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            {allProducts.length > 0 ? (
              <LandingCard trending={true} products={allProducts} />
            ) : (
              <div className="flex flex-col items-center justify-center ">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
                    <Zap className="text-purple-500" size={40} />
                  </div>
                  <h3 className="text-gray-800 font-bold text-lg">No Trending Products</h3>
                  <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                    Check back soon for trending items
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>


    </section >
  );
}