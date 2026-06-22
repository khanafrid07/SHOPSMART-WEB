import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LeftOverlay({ banner, rounded = true }) {
  const navigate = useNavigate();
  console.log(banner)
  return (
    <div
      className={`relative h-[55vh] md:h-[75vh] w-full overflow-hidden ${rounded ? "rounded-none sm:rounded-2xl md:rounded-3xl shadow-2xl" : "rounded-none"} group`}
    >
      {/* Image */}
      <motion.img
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        src={banner.image?.url}
        alt={banner.title || "banner"}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />

      {/* Dark gradient overlay
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/95 via-neutral-900/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent sm:hidden" /> */}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-12 md:px-20 lg:px-24 text-white md:w-2/3 lg:w-[60%]">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Subheading */}
          {banner.subHeading && (
            <p className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-primary mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-primary"></span>
              {banner.subHeading}
            </p>
          )}

          {/* Title */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 drop-shadow-lg">
            {banner.title}
          </h2>

          {/* Heading */}
          {banner.heading && (
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-medium leading-relaxed mb-8 sm:mb-10 max-w-xl">
              {banner.heading}
            </p>
          )}

          {/* CTA */}
          {banner.ctaText && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => banner.ctaLink && navigate(banner.ctaLink)}
              className="inline-flex w-fit items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white text-base sm:text-lg font-bold rounded-full hover:bg-primary-focus shadow-lg shadow-primary/30 transition-all"
            >
              {banner.ctaText}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}