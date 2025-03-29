'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

const routes = [
  {
    from: 'Tokyo',
    to: 'Osaka',
    distance: '17min',
    price: '$150',
    year: '2027',
    color: 'from-blue-400 to-purple-600'
  },
  {
    from: 'London',
    to: 'Paris',
    distance: '28min',
    price: '$180',
    year: '2027',
    color: 'from-green-400 to-blue-600'
  },
  {
    from: 'New York',
    to: 'Washington DC',
    distance: '29min',
    price: '$160',
    year: '2027',
    color: 'from-red-400 to-orange-600'
  }
];

const HyperloopMap = () => {
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [showARPreview, setShowARPreview] = useState(false);

  useEffect(() => {
    // Animate route lines
    routes.forEach((_, index) => {
      gsap.to(`#route-${index}`, {
        strokeDashoffset: 0,
        duration: 2,
        delay: index * 0.5,
        ease: 'power2.inOut'
      });
    });
  }, []);

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
            Hyperloop Network
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Experience the future of ground transportation with our revolutionary Hyperloop network.
            Connect major cities in minutes, not hours.
          </p>
        </motion.div>

        <div className="relative h-[600px] bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden">
          {/* Map Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
          </div>

          {/* Routes */}
          <svg className="absolute inset-0 w-full h-full">
            {routes.map((route, index) => (
              <motion.path
                key={index}
                id={`route-${index}`}
                d={`M ${100 + index * 150} 300 Q ${200 + index * 150} 200 ${300 + index * 150} 300`}
                fill="none"
                stroke={`url(#gradient-${index})`}
                strokeWidth="4"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                className="cursor-pointer"
                onClick={() => setSelectedRoute(index)}
              />
            ))}
            {routes.map((_, index) => (
              <defs key={index}>
                <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className={routes[index].color.split(' ')[0]} />
                  <stop offset="100%" className={routes[index].color.split(' ')[2]} />
                </linearGradient>
              </defs>
            ))}
          </svg>

          {/* Route Info */}
          <AnimatePresence>
            {selectedRoute !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg p-6 text-white"
              >
                <h3 className="text-2xl font-bold mb-2">
                  {routes[selectedRoute].from} → {routes[selectedRoute].to}
                </h3>
                <div className="flex gap-4 text-gray-300">
                  <span>{routes[selectedRoute].distance}</span>
                  <span>{routes[selectedRoute].price}</span>
                  <span>est. {routes[selectedRoute].year}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowARPreview(true)}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-sm font-semibold"
                >
                  View AR Pod Preview
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* AR Preview Modal */}
      <AnimatePresence>
        {showARPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={() => setShowARPreview(false)}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl w-full mx-4">
              <h3 className="text-2xl font-bold text-white mb-4">Hyperloop Pod AR Preview</h3>
              <p className="text-gray-300 mb-6">
                Scan the QR code below to view the Hyperloop pod in augmented reality.
                Make sure you have the latest version of our app installed.
              </p>
              <div className="bg-white p-4 rounded-lg w-48 h-48 mx-auto mb-6">
                {/* QR Code placeholder */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  QR Code
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowARPreview(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold"
              >
                Close Preview
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HyperloopMap; 