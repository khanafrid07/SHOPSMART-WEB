import { Flame } from "lucide-react"

export function FlashSaleSection() {
    return (
        <section className="relative py-14 bg-gradient-to-r from-red-50 via-white to-orange-50 overflow-hidden">

            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 text-red-500 font-semibold">
                        <Flame className="w-5 h-5 animate-pulse" />
                        Flash Sale
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Limited Time Deals 🔥
                    </h2>
                </div>

                {/* Fake Countdown */}
                <div className="flex gap-2 text-center">
                    {["12", "45", "09"].map((t, i) => (
                        <div key={i} className="bg-white shadow px-3 py-2 rounded-lg">
                            <p className="text-lg font-bold">{t}</p>
                            <p className="text-xs text-gray-500">
                                {i === 0 ? "Hrs" : i === 1 ? "Min" : "Sec"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Scroll */}
            <div className="max-w-7xl mx-auto px-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {[1, 2, 3, 4, 5].map((item) => (
                    <div
                        key={item}
                        className="min-w-[220px] bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-4 relative"
                    >
                        {/* badge */}
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            -30%
                        </span>

                        <div className="h-32 bg-gray-100 rounded-xl mb-3" />

                        <h3 className="font-semibold">Product Name</h3>
                        <p className="text-sm text-gray-500">Short description</p>

                        <div className="flex justify-between items-center mt-3">
                            <span className="font-bold text-red-500">₹999</span>
                            <button className="text-sm bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800">
                                Buy
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}