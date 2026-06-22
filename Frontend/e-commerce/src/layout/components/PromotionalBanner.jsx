import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Tag } from "lucide-react";

function useCountdown(targetDate) {
    const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(targetDate - Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const clamped = Math.max(timeLeft, 0);
    const days = Math.floor(clamped / (1000 * 60 * 60 * 24));
    const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((clamped / (1000 * 60)) % 60);
    const seconds = Math.floor((clamped / 1000) % 60);

    return { days, hours, minutes, seconds };
}

function TimeBox({ value, label }) {
    return (
        <div className="flex flex-col items-center bg-white/15 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 min-w-[44px] sm:min-w-[52px]">
            <span className="text-base sm:text-xl font-bold tabular-nums">{String(value).padStart(2, "0")}</span>
            <span className="text-[10px] sm:text-xs text-white/70 uppercase tracking-wide">{label}</span>
        </div>
    );
}

export function PromoBanner({ saleEndsAt }) {
    const navigate = useNavigate();
    // Defaults to 3 days from now if no end date is passed in
    const target = saleEndsAt ? new Date(saleEndsAt).getTime() : Date.now() + 3 * 24 * 60 * 60 * 1000;
    const { days, hours, minutes, seconds } = useCountdown(target);

    return (
        <section className="relative py-12 sm:py-16">

            {/* glow background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-pink-100 to-purple-100 blur-3xl opacity-40" />

            <div className="relative max-w-7xl mx-auto px-4">
                <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl p-8 sm:p-10 md:p-14 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">

                    {/* decorative blobs inside the card */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 left-1/3 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

                    {/* text */}
                    <div className="relative z-10 text-center md:text-left">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs sm:text-sm font-semibold mb-3">
                            <Sparkles size={14} />
                            Limited Time Offer
                        </span>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                            Big Winter Sale ❄️
                        </h2>
                        <p className="mt-2 text-white/80 text-sm sm:text-base">
                            Get up to 60% off on premium collections
                        </p>

                        {/* countdown */}
                        <div className="mt-5 flex justify-center md:justify-start gap-2 sm:gap-3">
                            <TimeBox value={days} label="Days" />
                            <TimeBox value={hours} label="Hrs" />
                            <TimeBox value={minutes} label="Min" />
                            <TimeBox value={seconds} label="Sec" />
                        </div>

                        <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                            <button
                                onClick={() => navigate("/products?sale=true")}
                                className="bg-white text-purple-700 px-5 py-2 rounded-xl font-semibold hover:scale-105 transition"
                            >
                                Shop Now
                            </button>

                            <button
                                onClick={() => navigate("/sale")}
                                className="border border-white px-5 py-2 rounded-xl hover:bg-white hover:text-purple-700 transition"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>

                    {/* decorative discount badge — replaces the empty placeholder box */}
                    <div className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 shrink-0 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/30 animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-4 rounded-full bg-white/10 backdrop-blur-sm" />
                        <div className="relative flex flex-col items-center justify-center text-center">
                            <Tag size={22} className="mb-1 text-white/80 sm:size-6" />
                            <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-none">60%</span>
                            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-white/80">Off</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}