import { useNavigate } from "react-router-dom";

export default function GradientPromo({ banner }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => banner.link && navigate(banner.link)}
      className="relative h-[220px] sm:h-[260px] w-full rounded-2xl overflow-hidden cursor-pointer group"
    >
      {/* IMAGE */}
      {banner.image && (
        <img
          src={banner?.image?.url}
          alt={banner.title}
          className="absolute w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
      )}

      {/* DARK GRADIENT (important fix) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* CONTENT */}
      <div className="relative h-full flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 sm:px-10 py-6 text-white">

        {/* Text */}
        <div className="max-w-md">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            {banner.title}
          </h2>

          {banner.subHeading && (
            <p className="mt-2 text-sm sm:text-base md:text-xl text-white/80">
              {banner.subHeading}
            </p>
          )}
        </div>


        {/* CTA */}
        {banner.ctaText && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent double trigger
              banner.ctaLink && navigate(banner.ctaLink);
            }}
            className="mt-4  sm:mt-0 px-4 sm:px-6 py-2 bg-white text-black md:text-xl rounded-full text-sm sm:text-lg font-semibold shadow-md hover:scale-105 transition"
          >
            {banner.ctaText}
          </button>
        )}
      </div>
    </div>
  );
}