'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop',
    title: 'Oceanix City',
    description: 'The world\'s first floating sustainable city',
    color: 'from-blue-400 to-cyan-600'
  },
  {
    src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop',
    title: 'The Muraka',
    description: 'Luxury underwater suite experience',
    color: 'from-purple-400 to-blue-600'
  }
];

const UnderwaterHotel = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [show360View, setShow360View] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen bg-black py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Underwater Luxury
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Experience the next frontier of luxury travel with our underwater accommodations.
            Immerse yourself in the beauty of the ocean while enjoying world-class amenities.
          </p>
        </motion.div>

        <motion.div 
          style={{ scale }}
          className="relative h-[600px] rounded-xl overflow-hidden"
        >
          {/* Parallax Image Gallery */}
          <motion.div
            style={{ y, opacity }}
            className="absolute inset-0"
          >
            <AnimatePresence mode="wait">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ 
                    opacity: activeImage === index ? 1 : 0,
                    scale: activeImage === index ? 1 : 1.1
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${image.src})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80 backdrop-blur-sm" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-center text-white"
                      >
                        <h3 className="text-3xl font-bold mb-2">{image.title}</h3>
                        <p className="text-xl text-gray-200">{image.description}</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* 360° View Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShow360View(true)}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Dive into 360° View
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            {
              title: 'Underwater Suites',
              description: 'Sleep surrounded by marine life in our luxury underwater accommodations',
              icon: '🌊'
            },
            {
              title: 'Ocean Conservation',
              description: 'Part of your stay contributes to marine conservation efforts',
              icon: '🐋'
            },
            {
              title: 'Unique Experiences',
              description: 'Dive with experts, marine life encounters, and underwater dining',
              icon: '🤿'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-white hover:bg-white/10 transition-colors duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 360° View Modal */}
      <AnimatePresence>
        {show360View && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={() => setShow360View(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl w-full mx-4"
            >
              <h3 className="text-2xl font-bold text-white mb-4">360° Underwater Experience</h3>
              <p className="text-gray-300 mb-6">
                Scan the QR code below to view our underwater suites in virtual reality.
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
                onClick={() => setShow360View(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold"
              >
                Close Preview
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default UnderwaterHotel; 