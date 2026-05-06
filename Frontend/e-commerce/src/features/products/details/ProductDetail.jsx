import { useParams } from "react-router-dom"
import { useGetProductsQuery, useViewProductQuery } from "../productSlice"
import { useEffect, useState } from "react"
import ProductInfo from "./ProductInfo"
import ProductImageGallery from "./ProductImageGallery"
import ProductVariants from "./ProductVariants"
import CartAndPrice from "./CartAndPrice"
import { useAddToCartMutation } from "../../cart/cart"
import { notifySuccess, notifyError } from "../../../utils/notify"
import SuggestedProduct from "../section/SuggestedProduct"
import Reviews from "../reviews/Reviews"
import { useSelector } from "react-redux"
import ProductDetailSkeleton from "../../../components/skeletons/ProductDetailSkeleton"
import { useAddToWishlistMutation } from "../../wishlist/wishlistSlice"
export default function ProductDetail() {
    const { id } = useParams()
    const { data, isLoading, refetch } = useViewProductQuery(id)
    const [addToCart, { isError, error, isLoading: isAdding }] = useAddToCartMutation()
    const [addToWishlist, { isError: isWishlistError, error: wishlistError, isLoading: isWishlistAdding }] = useAddToWishlistMutation()
    const { product } = data || {}
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [blockVar, setBlockVar] = useState(false)
    const user = useSelector((state) => state.auth.user)
    useEffect(() => {
        if (product) {
            const selectVariantByStock = product?.variants?.find((v) => v.stock > 0)
            console.log("selectVariantByStock", selectVariantByStock)
            if (selectVariantByStock) {
                setSelectedVariant(selectVariantByStock)

            } else {
                setSelectedVariant(product?.variants?.[0])

            }


        }
    }, [product])
    console.log("selectedvariant", selectedVariant)
    console.log("product", product)


    const handleAddToCart = async () => {
        if (!user) return notifyError("Please login to add item to cart");
        if (selectedVariant?.stock === 0) return notifyError("Out of Stock");

        try {
            await addToCart({
                productId: product._id,
                variantId: selectedVariant._id,
                quantity: 1,

            }).unwrap()
            notifySuccess("Item added to cart")
            refetch
        } catch (error) {
            notifyError(error?.data?.message || "Failed to add item to cart")

        }
    }
    const handleAddToWishlist = async () => {
        if (!user) return notifyError("Please login to add item to wishlist");
        try {
            await addToWishlist({
                productId: product._id,
                variantId: selectedVariant?._id,
            }).unwrap()
            notifySuccess("Item added to wishlist")
            refetch
        } catch (error) {
            notifyError(error?.data?.message || "Failed to add item to wishlist")

        }
    }


    return (
        <div>
            {isLoading && <ProductDetailSkeleton />}
            <div className="grid md:grid-cols-2 gap-3 py-4">

                <ProductImageGallery images={selectedVariant?.images?.length > 0 ? selectedVariant.images : product?.images || []} />
                <div className="px-2 md:px-4">
                    {!isLoading && <>
                        <ProductInfo info={selectedVariant} product={product} />

                        <ProductVariants setBlockVar={setBlockVar} images={product?.images} info={product} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} allVariant={product?.variants} />
                        <CartAndPrice blockVar={blockVar} isWishlistAdding={isWishlistAdding} handleAddToWishlist={handleAddToWishlist} loading={isAdding} onAdding={handleAddToCart} stock={selectedVariant?.stock} />
                        <Reviews refetch={refetch} reviews={product?.reviews || []} />
                    </>}

                </div>

            </div>
            <section className="px-4 md:px-8">

                <SuggestedProduct product={product} />
            </section>
        </div>
    )
}

