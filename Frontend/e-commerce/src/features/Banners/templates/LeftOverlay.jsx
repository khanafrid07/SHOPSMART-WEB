export default function LeftOverlay({ banner, rounded = true }) {
  return (
    <div
      className={`relative h-[45vh] md:h-[75vh] w-full  overflow-hidden ${rounded ? "rounded-none sm:rounded-xl" : "rounded-none"
        }`}
    >
      {/* Image */}
      <img

        src={banner.image.url}
        alt={banner.title || "banner"}
        className="w-full h-full object-cover scale-105"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center p-5 md:px-12 text-white md:w-1/2">

        {/* Subheading */}
        <p className="text-xs sm:text-sm tracking-widest uppercase text-gray-300">
          {banner.subHeading}
        </p>

        {/* Title */}
        <h2 className="mt-2 text-2xl sm:text-4xl md:text-5xl font-bold leading-tight">
          {banner.title}
        </h2>

        {/* Heading */}
        <p className="mt-3 text-base sm:text-lg md:text-2xl text-gray-200 font-medium">
          {banner.heading}
        </p>

        {/* CTA */}
        <a
          href={banner.ctaLink}
          className="mt-6 inline-flex w-fit items-center gap-2 px-5 py-2.5 
                     bg-white text-black font-semibold rounded-lg 
                     hover:bg-gray-200 transition-all duration-200 
                     active:scale-95"
        >
          {banner.ctaText}
        </a>
      </div>
    </div>
  );
}