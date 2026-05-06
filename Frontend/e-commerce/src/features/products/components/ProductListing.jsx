import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Search } from "lucide-react";
import { useGetProductsQuery } from "../productSlice";
import FilterSidebar from "./FilterSidebar";
import LandingCard from "./LandingCard";
import ProductCard from "./ProductCard";

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filters = {
    category: searchParams.get("category") || "",
    gender: searchParams.get("gender") || "",
    type: searchParams.get("type") || "",
    sort: searchParams.get("sort") || "",
    search: searchParams.get("search") || "",
    discount: searchParams.get("discount") || "",

  };


  function handleChange(key, value) {
    const p = new URLSearchParams(searchParams);

    if (key === "category") {
      p.delete("type");
      p.delete("search")
      if (value === "Beauty") p.delete("gender");
    }
    if (key === "gender") {
      p.delete("type");
      p.delete("search")
    }
    if (key === "discount") {
      if (value === "high") {
        p.set("sort", "discountHigh");
      } else if (value === "low") {
        p.set("sort", "discountLow");
      }
    }
    if (key === "price") {

      if (value === "low") {
        p.set("sort", "priceLow");
      } else if (value === "high") {
        p.set("sort", "priceHigh");
      }
    } else {
      value ? p.set(key, value.toLowerCase()) : p.delete(key);
    }
    setSearchParams(p);
  }


  const { data, isLoading } = useGetProductsQuery(Object.fromEntries(searchParams));


  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <span className="text-sm text-gray-400 animate-pulse">Loading products...</span>
    </div>
  );

  const products = data?.allProducts || [];

  return (
    <div className="flex mt-4 min-h-screen bg-gray-50">

      <FilterSidebar
        filters={filters}
        onChange={handleChange}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 p-5 md:p-7">
        <div className="flex  content-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex mb-4 items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-full hover:border-gray-400 transition-colors"
          >
            <SlidersHorizontal size={14} />
            Filters
            {Object.values(filters).filter(Boolean).length > 0 && (
              <span className="ml-1 bg-gray-900 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </button>

          {searchParams.get("search") && <p className="flex self-center mb-4 italic text-sm opacity-50">Search results for "{searchParams.get("search")}" {products.length} found.</p>}
        </div>

        {searchParams.get("search") && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
                <Search className="text-gray-400" size={48} />
              </div>
              <h3 className="text-gray-800 font-bold text-2xl">
                No results found
              </h3>
              <p className="text-gray-500 text-sm mt-3 max-w-sm">
                We couldn't find anything for
                <span className="font-semibold text-gray-700">
                  {" "}"{searchParams.get("search")}"{" "}
                </span>
              </p>
              <p className="text-gray-400 text-xs mt-4 max-w-sm">
                Try different keywords or check the filters
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}


      </main>

    </div>
  );
}