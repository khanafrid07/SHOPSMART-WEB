import { useGetProductsQuery } from "../productSlice";
import LandingCard from "../components/LandingCard";

export default function SuggestedProduct({ product }) {
    const category = product?.category?.main;

    const { data, isLoading, isError } = useGetProductsQuery(
        { category },
        { skip: !category }
    );

    if (!product) return null;

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading products</p>;

    const allProducts = data?.allProducts || [];

    const similarProduct = allProducts.filter(
        (p) => p._id !== product._id
    );

    return (
        <div className="w-full bg-base-100 mt-4">
            <h2 className="font-semibold py-4 text-2xl md:text-3xl text-base-content">
                Related & Similar Products
            </h2>

            <LandingCard products={similarProduct} />
        </div>
    );
}