import { motion } from 'framer-motion';
import { Users, TrendingUp, Package, Award } from 'lucide-react';

const StatisticsSection = () => {
  const stats = [
    { icon: Users, label: 'Active Customers', value: '50K+', color: 'from-blue-500 to-cyan-500' },
    { icon: Package, label: 'Products Sold', value: '100K+', color: 'from-purple-500 to-pink-500' },
    { icon: Award, label: 'Satisfaction Rate', value: '98%', color: 'from-green-500 to-emerald-500' },
    { icon: TrendingUp, label: 'Growth Rate', value: '45%', color: 'from-orange-500 to-red-500' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 text-xs sm:text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full mb-4"
          >
            <TrendingUp size={14} />
            By The Numbers
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900"
          >
            Trusted by Millions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto"
          >
            Join our growing community of satisfied customers who enjoy quality products and exceptional service
          </motion.p>
        </div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <motion.div
                  whileHover={{ translateY: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  className="group relative h-full p-6 sm:p-8 bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
                    {/* Icon Container */}
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`p-3 sm:p-4 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4 sm:mb-6 inline-flex`}
                    >
                      <Icon size={24} />
                    </motion.div>

                    {/* Value */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2"
                    >
                      {stat.value}
                    </motion.div>

                    {/* Label */}
                    <p className="text-gray-600 text-sm sm:text-base font-medium">{stat.label}</p>
                  </div>

                  {/* Border gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl p-0.5 opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}></div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default StatisticsSection;
