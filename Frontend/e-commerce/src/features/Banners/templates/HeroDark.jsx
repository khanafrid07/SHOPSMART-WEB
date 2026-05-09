export default function HeroDark({ banner }) {
  return (
    <div className="relative w-full h-[55vh] md:h-[75vh] overflow-hidden rounded-2xl">

      {/* IMAGE */}
      <img
        src={banner.image.url}
        alt={banner.title}
        className="w-full h-full object-cover"
      />

      {/* SOFT OVERLAY (gradient, not harsh black) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

      {/* CONTENT */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="px-6 md:px-12 max-w-xl text-center text-white">



          {/* TITLE */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-wide leading-tight">
            {banner.title}
          </h1>

          {/* SUBTEXT */}
          <p className="mt-3 text-sm md:text-lg text-white/80">
            {banner.subHeading}
          </p>

          {banner.ctaLink && (
            <a
              href={banner.ctaLink}
              className="inline-block mt-6 px-6 py-3 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-200 transition"
            >
              {banner.ctaText}
            </a>
          )}

        </div>
      </div>
    </div>
  );
}