'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import AIChatbot from '@/components/features/AIChatbot';
import TripPreferencesModal from '@/components/features/TripPreferencesModal';
import AIPersonalitySelector from '@/components/features/AIPersonalitySelector';
import QuestionFlow from '@/components/features/QuestionFlow';

interface AIPersonality {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
}

const travelPreferences = [
  { id: 'adventure', label: 'Adventure', icon: '🏃‍♂️' },
  { id: 'relaxation', label: 'Relaxation', icon: '🌴' },
  { id: 'culture', label: 'Culture', icon: '🏛️' },
  { id: 'luxury', label: 'Luxury', icon: '✨' }
];

const budgetRanges = [
  { min: 1000, max: 3000, label: '$1K - $3K' },
  { min: 3000, max: 5000, label: '$3K - $5K' },
  { min: 5000, max: 10000, label: '$5K - $10K' },
  { min: 10000, max: null, label: '$10K+' }
];

const nftPerks = [
  {
    name: 'Egyptian Sphinx NFT',
    description: 'Limited edition digital collectible',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    price: '0.5 ETH'
  },
  {
    name: 'Pyramid Access Pass',
    description: 'Exclusive virtual tour access',
    image: 'https://images.unsplash.com/photo-1503177119275-0fa32b8091d0?q=80&w=1000&auto=format&fit=crop',
    price: '0.3 ETH'
  }
];

export default function AIConciergePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreferences, setShowPreferences] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState<AIPersonality | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, any>>({});

  const handlePreferencesComplete = (preferences: any) => {
    setShowPreferences(false);
    setCurrentStep(2);
  };

  const handlePersonalitySelect = (personality: AIPersonality) => {
    setSelectedPersonality(personality);
    setCurrentStep(3);
  };

  const handleQuestionFlowComplete = (answers: Record<string, any>) => {
    setQuestionAnswers(answers);
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <AIChatbot />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black/80" />
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 gradient-text"
          >
            AI Travel Concierge
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Your Personal Travel Assistant
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Step Indicator */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep >= step
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                        : 'bg-white/10'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-16 h-0.5 mx-2 ${
                        currentStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/10'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold mb-6 gradient-text">Let's Start Planning Your Trip</h2>
                <p className="text-gray-400 mb-8">First, let's get to know your travel preferences</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPreferences(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Set Your Preferences
                </motion.button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AIPersonalitySelector onSelect={handlePersonalitySelect} />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <QuestionFlow onComplete={handleQuestionFlowComplete} />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold mb-6 gradient-text">Perfect! Let's Review Your Choices</h2>
                <div className="glass rounded-2xl p-8 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Selected AI Guide</h3>
                    <p className="text-gray-400">{selectedPersonality?.name}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Your Preferences</h3>
                    <pre className="text-gray-400 text-left">
                      {JSON.stringify(questionAnswers, null, 2)}
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Trip Preferences Modal */}
      <TripPreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        onComplete={handlePreferencesComplete}
      />
    </div>
  );
} 