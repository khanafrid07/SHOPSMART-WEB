import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GradientPromo({ banner }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => banner.ctaLink && navigate(banner.ctaLink)}
      className="relative h-[220px] sm:h-[260px] md:h-[300px] w-full rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer group shadow-xl"
    >
      {/* IMAGE */}
      {banner.image && (
        <motion.img
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
          src={banner.image?.url || banner.image}
          alt={banner.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
      )}

      DARK GRADIENT
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent group-hover:from-black/50 transition-colors duration-500" />

      {/* CONTENT */}
      <div className="relative h-full flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 sm:px-12 md:px-16 py-8 text-white">

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-wide mb-2 sm:mb-4 text-whtie">
            {banner.title}
          </h2>

          {banner.subHeading && (
            <p className="text-sm sm:text-lg md:text-xl text-white font-medium">
              {banner.subHeading}
            </p>
          )}

        </motion.div>

        {/* CTA */}
        {banner.ctaText && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              banner.ctaLink && navigate(banner.ctaLink);
            }}
            className="mt-6 sm:mt-0 px-6 sm:px-8 py-3 bg-white text-black rounded-full text-sm sm:text-base md:text-lg font-bold shadow-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            {banner.ctaText}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        )}
      </div>
    </div>
  );
}