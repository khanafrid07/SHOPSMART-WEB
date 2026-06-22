import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CenterMinimal({ banner, rounded = true }) {
  const navigate = useNavigate();
  return (
    <div className={`relative h-[55vh] md:h-[75vh] w-full flex items-center justify-center ${rounded ? "rounded-2xl md:rounded-3xl shadow-2xl" : "rounded-none"} overflow-hidden group`}>

      <motion.img
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        src={banner.image?.url}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px] transition-all duration-700 group-hover:backdrop-blur-0 group-hover:bg-neutral-900/50" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 text-center text-white px-6 py-12 max-w-4xl mx-auto flex flex-col items-center"
      >
        {banner.subHeading && (
          <span className="mb-4 sm:mb-6 font-bold tracking-[0.25em] text-xs sm:text-sm uppercase text-white/90 drop-shadow-md">
            {banner.subHeading}
          </span>
        )}

        <h2 className="text-5xl sm:text-6xl md:text-8xl font-extrabold text-white leading-tight mb-4 sm:mb-6 drop-shadow-xl">
          {banner.title}
        </h2>

        {banner.heading && (
          <p className="mt-2 text-lg sm:text-2xl md:text-3xl font-medium text-white/95 drop-shadow-lg max-w-2xl">
            {banner.heading}
          </p>
        )}

        {banner.ctaText && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => banner.ctaLink && navigate(banner.ctaLink)}
            className="mt-8 sm:mt-10 inline-block px-8 sm:px-10 py-3 sm:py-4 bg-white text-black sm:text-lg font-bold rounded-full shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_50px_rgba(255,255,255,0.45)] transition-all"
          >
            {banner.ctaText}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}