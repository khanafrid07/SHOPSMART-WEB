import { Star, Zap, Tags } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({
  product,
  featured,
  trending,
  newArrival,
}) {
  const navigate = useNavigate();

  const getBadge = () => {
    if (featured)
      return {
        icon: Star,
        label: "Featured",
        color: "from-amber-400 to-amber-500",
      };
    if (trending)
      return {
        icon: Zap,
        label: "Trending",
        color: "from-purple-500 to-pink-500",
      };
    if (newArrival)
      return {
        icon: Tags,
        label: "New",
        color: "from-pink-400 to-rose-500",
      };
    return null;
  };

  const badge = getBadge();
  const Icon = badge?.icon;

  const image =
    product?.images?.[0]?.url ||
    "https://via.placeholder.com/300";

  const hasDiscount = product?.discount;
  const priceWithoutDiscount = Math.floor((product?.basePrice * 100) / (100 - product?.discount))

  return (
    <div
      onClick={() => navigate(`/products/${product.slug}-${product._id}`)}
      className="group cursor-pointer w-full min-w-0 ]
           rounded-t-xl overflow-hidden bg-gray-100 shadow-sm 
           hover:shadow-xl transition duration-300"
    >
      {/* IMAGE */}
      <div className="relative w-full h-[12rem] sm:h-[13rem] md:h-[13rem] lg:h-[16rem]  overflow-hidden">
        <img
          src={image}
          alt={product?.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />

        {/* BADGE */}
        {badge && (
          <div
            className={`absolute top-2 left-2 flex items-center gap-1 
                        text-[10px] sm:text-xs px-2 py-1 rounded-full 
                        text-white bg-gradient-to-r ${badge.color}`}
          >
            <Icon size={12} />
            {badge.label}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-2 sm:p-3 space-y-1">
        <h3 className="text-xs sm:text-sm font-semibold line-clamp-1">
          {product?.title}
        </h3>

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-1">
          {hasDiscount ? (
            <>
              <span className="text-xs sm:text-sm font-bold text-purple-600">
                Rs. {Math.round(product?.basePrice)}
              </span>
              <span className="text-[10px] sm:text-xs line-through text-gray-400">
                Rs. {priceWithoutDiscount}
              </span>
              <span className="text-xs sm:text-sm font-bold text-red-600">
                - {product?.discount}%
              </span>
            </>
          ) : (
            <span className="text-xs sm:text-sm font-bold">
              Rs. {product?.basePrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}