import { useNavigate } from "react-router-dom";
import { memo } from "react";


const CategoryCard = memo(({ item, gender }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products?category=clothing&gender=${gender.toLowerCase()}&type=${item.name}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Background Image */}
      <img
        src={item.image}
        alt={item.name}
        loading="lazy"
        className="w-full h-44 sm:h-62 md:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
      />


      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h3 className="text-xl font-bold capitalize tracking-wide drop-shadow-md">
          {item.name}
        </h3>
      </div>


      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="bg-white/90 backdrop-blur-sm text-gray-900 font-semibold px-6 py-2.5 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          Shop Now
        </button>
      </div>
    </div>
  );
});

export default CategoryCard;
