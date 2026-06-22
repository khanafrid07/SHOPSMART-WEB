import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Fashion Enthusiast',
      comment: 'The quality of products is exceptional! Fast delivery and amazing customer service. Highly recommended!',
      rating: 5,
      avatar: '👩‍🦰',
    },
    {
      name: 'Mike Chen',
      role: 'Regular Customer',
      comment: 'Best online shopping experience. The prices are competitive and the selection is incredible. Love it!',
      rating: 5,
      avatar: '👨‍💼',
    },
    {
      name: 'Emma Wilson',
      role: 'Beauty Lover',
      comment: 'Outstanding service and authentic products. The packaging is beautiful and everything arrived safely.',
      rating: 5,
      avatar: '👩‍🎨',
    },
    {
      name: 'David Martinez',
      role: 'Accessory Collector',
      comment: 'Great deals and genuine products. Customer support is super helpful and responsive!',
      rating: 5,
      avatar: '👨‍🎓',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -15 },
    visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-8 lg:px-16 bg-gradient-to-b from-white via-purple-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 text-xs sm:text-sm font-medium bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 rounded-full mb-4"
          >
            <Star size={14} />
            Customer Love
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900"
          >
            What Our Customers Say
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto"
          >
            Real experiences from real customers who have transformed their shopping journey with us
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <motion.div
                whileHover={{ translateY: -12, boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}
                className="group h-full p-6 sm:p-7 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Quote Icon */}
                <div className="mb-4 inline-flex w-fit p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg text-purple-600 group-hover:from-purple-200 group-hover:to-pink-200 transition-colors">
                  <Quote size={20} />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6 flex-grow">
                  "{testimonial.comment}"
                </p>

                {/* Divider */}
                <div className="border-t border-gray-100 mb-5 pt-5"></div>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 sm:mt-14 text-center"
        >
          <button className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30">
            <span className="relative z-10 flex items-center justify-center gap-2">
              Read All Reviews
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
