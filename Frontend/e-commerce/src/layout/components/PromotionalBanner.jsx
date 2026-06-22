export function PromoBanner() {
    return (
        <section className="relative py-16">

            {/* glow background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-pink-100 to-blue-100 blur-3xl opacity-40" />

            <div className="relative max-w-7xl mx-auto px-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl p-10 md:p-14 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">

                    {/* text */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Big Winter Sale ❄️
                        </h2>
                        <p className="mt-2 text-white/80">
                            Get up to 60% off on premium collections
                        </p>

                        <div className="mt-6 flex gap-3">
                            <button className="bg-white text-black px-5 py-2 rounded-xl font-semibold hover:scale-105 transition">
                                Shop Now
                            </button>

                            <button className="border border-white px-5 py-2 rounded-xl hover:bg-white hover:text-black transition">
                                Learn More
                            </button>
                        </div>
                    </div>

                    {/* floating image placeholder */}
                    <div className="w-40 h-40 md:w-52 md:h-52 bg-white/20 rounded-2xl animate-pulse" />
                </div>
            </div>
        </section>
    )
}