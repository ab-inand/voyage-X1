'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HolographicOverlay from '@/components/HolographicOverlay';

// Dynamically import components that use browser APIs
const QuestionFlow = dynamic(() => import('@/components/features/QuestionFlow'), {
  ssr: false,
});

const Auth = dynamic(() => import('@/components/features/Auth'), {
  ssr: false,
});

export default function AITravelDesigner() {
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authRef = useRef<{ open: () => void }>(null);

  useEffect(() => {
    setIsMounted(true);
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!token && !!user);

    // Activate overlay after a brief delay
    const timer = setTimeout(() => {
      setIsOverlayActive(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleQuestionFlowComplete = (answers: Record<string, any>) => {
    if (!isAuthenticated && authRef.current) {
      // If not authenticated, show login modal
      authRef.current.open();
      return;
    }
    console.log('Question flow completed with answers:', answers);
    // Handle the answers here
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AnimatePresence>
        {isOverlayActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            
          </motion.div>
        )}
      </AnimatePresence>

      <QuestionFlow onComplete={handleQuestionFlowComplete} />
      <Auth ref={authRef} defaultMode="login" />
    </div>
  );
}
