'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const Web3Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsMinting(true);

    // TODO: Implement newsletter subscription and NFT minting logic
    setTimeout(() => {
      setIsSubmitting(false);
      setIsMinting(false);
    }, 2000);
  };

  return (
    <section className="relative min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Join the Future
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Subscribe to our newsletter and receive a unique NFT postcard from the future of travel.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 bg-white/10 border-white/20 rounded text-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-300">
                    I agree to receive updates and accept the{' '}
                    <a href="#" className="text-blue-400 hover:text-blue-300">
                      Terms of Service
                    </a>
                  </label>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || isMinting}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? 'Subscribing...' : isMinting ? 'Minting NFT...' : 'Subscribe & Get NFT Postcard'}
              </motion.button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-400">
              <p>Your data is secure and will never be shared with third parties.</p>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: 'Exclusive Updates',
                description: 'Get early access to new travel experiences and special offers'
              },
              {
                title: 'NFT Collection',
                description: 'Receive unique NFT postcards from different destinations'
              },
              {
                title: 'Member Benefits',
                description: 'Enjoy special discounts and perks as a newsletter subscriber'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-white"
              >
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Web3Newsletter; 