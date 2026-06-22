import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroDark({ banner }) {
  const navigate = useNavigate();
  return (
    <div className="relative w-full h-[55vh] md:h-[75vh] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl group">
      {/* IMAGE */}
      <motion.img
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        src={banner.image || banner.image?.url}
        alt={banner.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
      />

      {/* SOFT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/70 via-transparent to-transparent" />

      {/* CONTENT */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="px-6 md:px-12 max-w-4xl text-center text-white flex flex-col items-center"
        >
          {/* SUBTEXT */}
          {banner.subHeading && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white font-bold tracking-[0.2em] uppercase mb-6 border border-white/20">
              {banner.subHeading}
            </span>
          )}

          {/* TITLE */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 drop-shadow-xl">
            {banner.title}
          </h1>

          {/* HEADING / DESC */}
          {banner.heading && (
            <p className="text-base sm:text-xl md:text-2xl text-gray-200 font-medium max-w-2xl leading-relaxed mb-8 drop-shadow-md">
              {banner.heading}
            </p>
          )}

          {banner.ctaText && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => banner.ctaLink && navigate(banner.ctaLink)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full text-base sm:text-lg font-bold shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all"
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