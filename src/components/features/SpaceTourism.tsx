'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { getNextLaunch, formatLaunchDate, type SpaceXLaunch } from '@/lib/spacex';

const LoadingScreen = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="text-white text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-lg">Loading 3D Model...</p>
    </div>
  </div>
);

const OrbitalHotel = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main structure */}
      <mesh 
        position={[0, 0, 0]}
        onPointerOver={() => setHoveredPart('main')}
        onPointerOut={() => setHoveredPart(null)}
      >
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <meshStandardMaterial
          color={hoveredPart === 'main' ? '#6ba4e7' : '#4a90e2'}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Rings */}
      <mesh 
        position={[0, 0, 0]} 
        rotation={[Math.PI / 2, 0, 0]}
        onPointerOver={() => setHoveredPart('rings')}
        onPointerOut={() => setHoveredPart(null)}
      >
        <torusGeometry args={[2, 0.1, 16, 100]} />
        <meshStandardMaterial
          color={hoveredPart === 'rings' ? '#ffffff' : '#e0e0e0'}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Windows */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(i * Math.PI / 6) * 1.5,
            Math.sin(i * Math.PI / 6) * 1.5,
            0
          ]}
          onPointerOver={() => setHoveredPart(`window-${i}`)}
          onPointerOut={() => setHoveredPart(null)}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={hoveredPart === `window-${i}` ? '#ffffff' : '#e0e0e0'}
            emissive={hoveredPart === `window-${i}` ? '#ffffff' : '#000000'}
            emissiveIntensity={hoveredPart === `window-${i}` ? 1 : 0.5}
          />
        </mesh>
      ))}

      {/* Ambient particles */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
};

const SpaceTourism = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [nextLaunch, setNextLaunch] = useState<SpaceXLaunch | null>(null);
  const [countdown, setCountdown] = useState<string>('Loading...');

  useEffect(() => {
    const fetchLaunchData = async () => {
      const launch = await getNextLaunch();
      setNextLaunch(launch);
      if (launch) {
        setCountdown(formatLaunchDate(launch.date_utc));
      }
    };

    fetchLaunchData();
    const interval = setInterval(() => {
      if (nextLaunch) {
        setCountdown(formatLaunchDate(nextLaunch.date_utc));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [nextLaunch]);

  const handleMintNFT = async () => {
    setIsMinting(true);
    // TODO: Implement NFT minting logic
    setTimeout(() => {
      setIsMinting(false);
    }, 2000);
  };

  return (
    <section className="relative min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 3D Model */}
          <div className="h-[500px] relative">
            <Suspense fallback={<LoadingScreen />}>
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <OrbitalHotel />
                <OrbitControls 
                  enableZoom={true} 
                  enablePan={true}
                  minDistance={3}
                  maxDistance={10}
                  enableDamping
                  dampingFactor={0.05}
                />
              </Canvas>
            </Suspense>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Orbital Hotel Experience
            </h2>
            <p className="text-gray-300 mb-8">
              Be among the first to experience luxury accommodations in low Earth orbit. 
              Our state-of-the-art orbital hotel offers breathtaking views of Earth and 
              unique zero-gravity experiences.
            </p>
            
            <div className="space-y-6">
              {/* SpaceX Launch Countdown */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">Next SpaceX Launch</h3>
                <div className="flex items-center gap-4">
                  {nextLaunch?.links.patch.small && (
                    <img 
                      src={nextLaunch.links.patch.small} 
                      alt={nextLaunch.name}
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <div>
                    <p className="text-gray-300">{nextLaunch?.name || 'Loading...'}</p>
                    <p className="text-2xl font-bold text-blue-400">{countdown}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">Duration</h3>
                <p className="text-gray-300">3-7 days stay</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">Price</h3>
                <p className="text-gray-300">Starting from $500,000</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMintNFT}
              disabled={isMinting}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isMinting ? 'Minting...' : 'Reserve Your Spot → Mint NFT Pass'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SpaceTourism; 