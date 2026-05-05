import { Heart, ShoppingBag } from "lucide-react";

export default function CartAndPrice({ loading, onAdding, stock }) {
    return (
        <div className="m-4 grid gap-4 sm:grid-cols-2">

            <button disabled={stock === 0 || loading} onClick={() => onAdding()}
                className="flex items-center justify-center gap-2 
        bg-black text-white font-semibold py-3 rounded-xl 
        hover:bg-gray-900 active:scale-95 transition-all duration-200 shadow-md"
            >
                <ShoppingBag size={20} />
                {stock === 0 ? "Out of Stock" : loading ? "Adding..." : "Add to Cart"}
            </button>


            <button
                className="flex items-center justify-center gap-2 
        bg-red-500 text-white font-semibold py-3 rounded-xl 
        hover:bg-red-600 active:scale-95 transition-all duration-200 shadow-md"
            >
                <Heart size={20} />
                Wishlist
            </button>

        </div>
    );
}