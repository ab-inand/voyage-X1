'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function BackToEarth() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const createParticle = () => {
    const newParticle = {
      id: Date.now(),
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100
    };
    setParticles(prev => [...prev, newParticle]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);
  };

  const scrollToTop = () => {
    const audio = new Audio('/sounds/rocket-launch.mp3');
    audio.play().catch(error => console.log('Audio play failed:', error));

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.5,
        y: isVisible ? 0 : 20
      }}
      transition={{ duration: 0.3 }}
      className="w-full flex justify-center mb-8"
    >
      <motion.button
        onClick={scrollToTop}
        onHoverStart={() => {
          setIsHovered(true);
          const interval = setInterval(createParticle, 200);
          setTimeout(() => clearInterval(interval), 1000);
        }}
        onHoverEnd={() => setIsHovered(false)}
        className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all duration-500 flex items-center gap-3 group relative overflow-hidden"
      >
        {/* Space background effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800"
          animate={{
            x: isHovered ? ['0%', '100%', '0%'] : '0%',
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Stars effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                opacity: 0
              }}
              animate={{
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-blue-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content */}
        <motion.span
          className="text-base font-semibold relative z-10"
          animate={{
            scale: isHovered ? 1.05 : 1,
            textShadow: isHovered ? '0 0 8px rgba(255,255,255,0.5)' : 'none'
          }}
          transition={{ duration: 0.2 }}
        >
          Back to Earth
        </motion.span>

        {/* Rocket with enhanced animation */}
        <motion.span
          animate={{
            y: [0, -5, 0],
            rotate: [0, 5, -5, 0],
            scale: isHovered ? 1.1 : 1,
            filter: isHovered ? 'brightness(1.2)' : 'brightness(1)'
          }}
          transition={{
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            },
            rotate: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            },
            scale: {
              duration: 0.2
            }
          }}
          className="text-2xl relative z-10"
        >
          🚀
        </motion.span>

        {/* Dynamic particle effects */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ 
              x: particle.x,
              y: particle.y,
              opacity: 0,
              scale: [1, 0.5, 0]
            }}
            transition={{ 
              duration: 1,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.button>
    </motion.div>
  );
} 