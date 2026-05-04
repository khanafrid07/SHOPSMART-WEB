
import TrendingProducts from "../section/TrendingProducts"
import Skincare from "./Beauty/Skincare"
import Category from "./Beauty/Category"
import { useGetBannerQuery } from "../../Banners/BannerSlice"
import BannerSlot from "../../Banners/components/BannerSlot"
import EmptyState from "../../../components/common/EmptyState"
import NewArrivals from "../section/NewArrivals"
export default function BeautySection() {
  const { data } = useGetBannerQuery({ type: "category", category: "beauty" })

  return (
    <>
      <div className="w-full sm:pl-4 overflow-hidden">
        <BannerSlot banners={data} placement={"home_top"} />
      </div>
      <div className="p-2 mt-6 px-4 sm:p-8">

        <TrendingProducts category={"Beauty"} />
      </div>

      <div className="w-full space-y-6">
        <Skincare />
      </div>
      <div>
        <Category />
      </div>
      <div className="px-4">
        {/* <ShopConcern /> */}
        <NewArrivals category={"Beauty"} />
      </div>
      <EmptyState />
    </>


  )
}