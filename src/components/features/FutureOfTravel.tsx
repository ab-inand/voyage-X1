'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Text3D, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const StarField = () => {
  const starsRef = useRef<THREE.Points>(null);
  const [stars] = useState(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2000;
      positions[i + 1] = (Math.random() - 0.5) * 2000;
      positions[i + 2] = (Math.random() - 0.5) * 2000;
    }
    return positions;
  });

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.x += 0.0001;
      starsRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes.position"
          count={1000}
          array={stars}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        color="#ffffff"
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
};

const FutureOfTravel = () => {
  const [countdown, setCountdown] = useState('Loading...');

  useEffect(() => {
    // Simulated SpaceX launch countdown
    const updateCountdown = () => {
      const now = new Date();
      const launch = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
      const diff = launch.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setCountdown(`${days}d ${hours}h ${minutes}m`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <StarField />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Travel Beyond Earth: 2026 & Beyond
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the future of travel with SpaceX integration, orbital hotels, and immersive technology.
          </p>
          
          {/* SpaceX Countdown */}
          <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 mb-8 inline-block border border-blue-500/20 shadow-lg">
            <p className="text-blue-400 font-semibold text-base mb-1">Next SpaceX Launch</p>
            <p className="text-2xl md:text-3xl text-white font-mono">{countdown}</p>
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-400/20"
          >
            Explore Future Journeys
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FutureOfTravel; 