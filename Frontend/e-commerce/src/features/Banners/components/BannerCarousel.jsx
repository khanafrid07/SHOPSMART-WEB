import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BannerRenderer from "./BannerRenderer";

export default function BannerCarousel({ banners = [], rounded = true, interval = 4000 }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartX = useRef(null);

    useEffect(() => {
        if (!banners.length || isPaused) return;

        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % banners.length);
        }, interval);

        return () => clearInterval(timer);
    }, [banners.length, interval, isPaused]);

    if (!banners.length) return null;

    const goTo = (i) => setActiveIndex(i);
    const next = () => setActiveIndex((prev) => (prev + 1) % banners.length);
    const prev = () => setActiveIndex((p) => (p - 1 + banners.length) % banners.length);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) {
            delta > 0 ? prev() : next();
        }
        touchStartX.current = null;
    };

    return (
        <div
            className="relative w-full overflow-hidden group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* TRACK */}
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div key={banner._id} className="w-full flex-shrink-0">
                        <BannerRenderer banner={banner} rounded={rounded} />
                    </div>
                ))}
            </div>

            {/* PREV / NEXT ARROWS — visible on hover (desktop), always visible on touch devices via opacity fallback */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        aria-label="Previous banner"
                        className="hidden sm:flex absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-full bg-base-100/80 backdrop-blur-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-base-100"
                    >
                        <ChevronLeft className="w-5 h-5 text-neutral" />
                    </button>
                    <button
                        onClick={next}
                        aria-label="Next banner"
                        className="hidden sm:flex absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-full bg-base-100/80 backdrop-blur-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-base-100"
                    >
                        <ChevronRight className="w-5 h-5 text-neutral" />
                    </button>
                </>
            )}

            {/* PROGRESS-STYLE DOT INDICATORS, on-brand gradient for the active dot */}
            {banners.length > 1 && (
                <div className="absolute bottom-4 sm:bottom-5 left-0 right-0 z-30 flex justify-center gap-2">
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={`Go to banner ${i + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex
                                    ? "w-7 sm:w-8 bg-gradient-to-r from-primary to-secondary"
                                    : "w-2 bg-white/60 hover:bg-white/90"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}