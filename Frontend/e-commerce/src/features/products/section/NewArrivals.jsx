import { useGetProductsQuery } from "../productSlice";
import LandingCard from "../components/LandingCard";
import { Sparkles, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCardSkeleton from "../../../components/skeletons/productCardSkeleton";


export default function NewArrivals({ category, gender }) {
  const navigate = useNavigate();
  const [limit, setLimit] = useState(
    window.innerWidth < 768 ? 6 : 8
  );


  const { isLoading, isError, data, refetch } = useGetProductsQuery({
    sort: "newest",
    limit: limit,
    category,
    gender,
  });


  useEffect(() => {
    const handleResize = () => {
      const newLimit = window.innerWidth < 768 ? 4 : 8
      setLimit(prev => (prev !== newLimit ? newLimit : prev))
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const { allProducts = [] } = data || {};
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: limit }).map((_, i) => (
          <div className="w-full" key={i}><ProductCardSkeleton /></div>
        ))}
      </div>
    );
  }


  return (
    <section id="new-arrivals" className="relative sm:px-6 md:px-8 lg:px-10 w-full max-w-full overflow-hidden py-12 md:py-20">

      {/*  header */}
      <div className="mb-8 md:mb-12 flex items-end justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3
                          bg-amber-100 text-amber-700 rounded-full text-[10px]
                          font-bold uppercase tracking-widest">
            <Sparkles size={11} />
            Just Arrived
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            New{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
              Arrivals
            </span>
          </h2>
          <p className="mt-2 text-sm text-gray-500 max-w-sm">
            Fresh styles added this week — be the first to shop them.
          </p>
        </div>

        {/* View all */}
        {!isLoading && allProducts.length > 0 && (
          <button
            onClick={() => navigate(`/products?sort=newest${gender ? '&gender=' + gender : ''}${category ? '&category=' + category : ''}`)}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold
                       text-gray-700 hover:text-orange-600 transition-colors duration-200 group"
          >
            View All
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        )}
      </div>




      {isError && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
          <p className="text-gray-600 font-semibold mb-4">Failed to load new arrivals</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white
                       text-sm font-bold rounded-full hover:bg-gray-700 transition-colors duration-200"
          >
            <Loader2 size={14} /> Try Again
          </button>
        </div>
      )}

      {/* ── Products grid ── */}
      {!isLoading && !isError && (
        <>
          {allProducts.length > 0 ? (
            <>
              <LandingCard newArrival={true} products={allProducts} />

              {/* Mobile "View All" */}
              <div className="mt-8 flex justify-center sm:hidden">
                <button
                  onClick={() => navigate("/products?sort=newest")}
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-900
                             text-gray-900 text-sm font-bold rounded-full
                             hover:bg-gray-900 hover:text-white transition-all duration-200 group"
                >
                  View All New Arrivals
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>

              {/* Product count */}
              <p className="mt-6 text-center text-xs text-gray-400 font-medium">
                Showing{" "}
                <span className="font-bold text-orange-500">{allProducts.length}</span>{" "}
                of the latest products
              </p>
            </>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                <Sparkles className="text-amber-400" size={32} />
              </div>
              <h3 className="text-gray-800 font-bold text-lg">Nothing new yet</h3>
              <p className="text-gray-400 text-sm mt-1 max-w-xs">
                Check back soon — new arrivals drop weekly.
              </p>
            </div>
          )}
        </>
      )}

    </section>
  );
}
