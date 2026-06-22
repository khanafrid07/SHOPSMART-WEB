import { motion } from 'framer-motion';
import { Mail, ArrowRight, Heart } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Thanks for subscribing! Check your email for exclusive offers.');
      setEmail('');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative group"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-all duration-500"></div>

          {/* Main Card */}
          <motion.div
            whileHover={{ y: -8 }}
            className="relative bg-white rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-b from-purple-100 to-transparent rounded-full blur-3xl -mr-32 -mt-32 opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-t from-pink-100 to-transparent rounded-full blur-3xl -ml-32 -mb-32 opacity-40"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <motion.div variants={itemVariants} className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full mb-4 sm:mb-6">
                  <Heart size={16} className="animate-pulse" />
                  <span className="text-xs sm:text-sm font-semibold">Exclusive Offers</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Get Special Deals & Early Access
                </h2>

                <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                  Be the first to know about our latest products, special offers, and exclusive discounts. Subscribe now and enjoy <span className="font-bold text-purple-600">15% off</span> your first purchase!
                </p>
              </motion.div>

              {/* Form */}
              <motion.form
                variants={itemVariants}
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-2xl mx-auto mb-6"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 placeholder-gray-500 text-gray-900"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                  type="submit"
                  className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? 'Subscribing...' : 'Subscribe'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </motion.button>
              </motion.form>

              {/* Benefits */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-gray-200">
                {[
                  { icon: '🎁', text: 'Exclusive Deals' },
                  { icon: '🚀', text: 'Early Access' },
                  { icon: '💌', text: 'Weekly Updates' },
                ].map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-center sm:justify-start gap-3"
                  >
                    <span className="text-2xl">{benefit.icon}</span>
                    <span className="text-sm sm:text-base text-gray-600 font-medium">{benefit.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Privacy Notice */}
              <motion.p variants={itemVariants} className="text-center text-xs text-gray-500 mt-6">
                We respect your privacy. Unsubscribe at any time.
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
