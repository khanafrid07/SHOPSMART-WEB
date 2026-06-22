import { Star } from "lucide-react"

export function ReviewSection() {
    const reviews = [
        {
            name: "Aarav",
            text: "Amazing quality and super fast delivery!",
        },
        {
            name: "Priya",
            text: "Loved the experience. Will buy again!",
        },
        {
            name: "John",
            text: "Best online shopping site I’ve used.",
        },
    ]

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 text-center mb-10">
                <h2 className="text-3xl font-bold">What Customers Say</h2>
                <p className="text-gray-500 mt-2">
                    Real feedback from real buyers
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6">
                {reviews.map((r, i) => (
                    <div
                        key={i}
                        className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
                    >
                        {/* stars */}
                        <div className="flex gap-1 text-yellow-400 mb-3">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className="w-4 h-4 fill-yellow-400" />
                            ))}
                        </div>

                        <p className="text-gray-600">"{r.text}"</p>

                        <div className="flex items-center gap-3 mt-5">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
                            <div>
                                <p className="font-semibold">{r.name}</p>
                                <p className="text-xs text-gray-500">Verified Buyer</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}