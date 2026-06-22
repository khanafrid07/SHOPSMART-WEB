import { Truck, ShieldCheck, RotateCcw } from "lucide-react"
import { useGetBannerQuery } from "../../features/Banners/BannerSlice"
import BannerSlot from "../../features/Banners/components/BannerSlot"
import BannerSkeleton from "../skeletons/BannerSkeleton"

export default function Hero() {
  const { data: banners, isLoading } = useGetBannerQuery({ type: "hero" })

  if (isLoading) {
    return <BannerSkeleton />
  }

  return (
    <section className="relative w-full bg-gradient-to-br from-violet-50 via-white to-pink-50 overflow-hidden">
      <div className="relative z-10 max-w-full mx-auto  sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        <BannerSlot placement="home_top" banners={banners} rounded={true} />
      </div>

    </section>
  )
}