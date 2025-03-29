'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface HolographicOverlayProps {
  children: ReactNode;
}

export default function HolographicOverlay({ children }: HolographicOverlayProps) {
  return (
    <div className="relative w-full h-full">
      {/* Background gradient with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 animate-gradient-shift" />
      
      {/* Holographic grid effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Glowing border effect */}
      <div className="absolute inset-0 border-2 border-transparent rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg animate-border-glow" />
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-blue-400/50" />
      <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-purple-400/50" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-pink-400/50" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-blue-400/50" />
    </div>
  );
} 
