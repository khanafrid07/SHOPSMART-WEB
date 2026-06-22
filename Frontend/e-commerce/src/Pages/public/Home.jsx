import Hero from "../../components/sections/Hero";
import CategorySection from "../../components/sections/CategorySection";
import FeaturedProduct from "../../features/products/section/FeaturedProduct";
import TrendingProducts from "../../features/products/section/TrendingProducts";
import NewArrivals from "../../features/products/section/NewArrivals";
import FashionCollection from "../../components/sections/FashionCollection";
import OfferSignup from "../../components/sections/OfferSignup";
import LoginPopup from "../../components/sections/LoginPopup";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FlashSaleSection } from "../../layout/components/FlashsaleSection";
import { PromoBanner } from "../../layout/components/PromotionalBanner";
import { ReviewSection } from "../../layout/components/CustomerReviews";
export default function Home() {
    const user = useSelector((state) => state.auth.user);
    const [popup, setPopup] = useState(false);
    useEffect(() => {
        if (!user) {
            const timer = setTimeout(() => {
                setPopup(true)
            }, 6000)
            return () => clearTimeout(timer);
        }
    }, [user])

    const handleClose = () => {
        setPopup(false)
    }
    return (

        <>


            < Hero />
            {popup &&
                <LoginPopup onClose={handleClose} />
            }
            <main className="w-full px-4  sm:pl-3 overflow-x-hidden">
                <CategorySection />
                {/* <FlashSaleSection /> */}


                <FeaturedProduct />
                {/* <PromoBanner /> */}
                <TrendingProducts />
                <FashionCollection />

                <NewArrivals />
                {/* <ReviewSection /> */}
                <OfferSignup />


            </main>
        </>
    )
}