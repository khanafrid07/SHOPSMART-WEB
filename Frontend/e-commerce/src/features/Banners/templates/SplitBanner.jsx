import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SplitBanner({ banner }) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] lg:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden bg-base-100 shadow-2xl group">

      {/* Left Content */}
      <div className="flex flex-col justify-center px-8 py-12 lg:px-16 xl:px-20 relative overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80">

        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          {banner.subHeading && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold tracking-widest uppercase mb-6">
              {banner.subHeading}
            </span>
          )}

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral leading-[1.1] mb-6">
            {banner.title}
          </h2>

          {banner.heading && (
            <p className="text-base sm:text-lg text-neutral/70 font-medium leading-relaxed mb-8 max-w-md">
              {banner.heading}
            </p>
          )}

          {banner.ctaText && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => banner.ctaLink && navigate(banner.ctaLink)}
              className="inline-flex w-fit items-center gap-2 px-8 py-4 bg-neutral-900 text-white text-base font-bold rounded-full hover:bg-neutral-800 shadow-xl transition-all"
            >
              {banner.ctaText}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Right Image */}
      <div className="relative h-[300px] sm:h-[400px] lg:h-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={banner.image || banner.image?.url}
          alt={banner.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-neutral-900/5 group-hover:bg-transparent transition-colors duration-500"></div>
      </div>
    </div>
  );
}