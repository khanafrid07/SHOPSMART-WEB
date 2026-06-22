import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CleanImage({ banner, rounded = false }) {
  const navigate = useNavigate();
  return (
    <div className={`relative h-[50vh] md:h-[75vh] w-full ${rounded ? "rounded-sm md:rounded-3xl shadow-2xl" : "rounded-none"} overflow-hidden group`}>

      {/* Image */}
      <motion.img
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        src={banner.image?.url || banner.image}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/60  to-black/20 md:w-2/3"></div>

      <div className=" absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24 text-neutral-900 md:w-2/3 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {banner.subHeading && (
            <p className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white mb-4 flex items-center gap-2">
              <span className="sm:w-8 h-px bg-white"></span>
              {banner.subHeading}
            </p>
          )}

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] mb-4 text-gray-100">
            {banner.title}
          </h2>




          {banner.heading && (
            <p className="text-base  sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-medium leading-relaxed mb-8 max-w-xl">
              {banner.heading}..
            </p>
          )}


          {banner.ctaText && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => banner.ctaLink && navigate(banner.ctaLink)}
              className="inline-flex w-fit mt-4 items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-700 via-pink-400 to-blue-500 text-white text-base font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              {banner.ctaText}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>
      </div >
    </div >
  );
}