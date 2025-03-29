import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface TripPreferences {
  destinationType: string;
  budget: number;
  startDate: string;
  endDate: string;
}

interface TripPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (preferences: TripPreferences) => void;
}

const destinationTypes = [
  { id: 'beach', label: 'Beach', icon: '🏖️' },
  { id: 'mountain', label: 'Mountain', icon: '⛰️' },
  { id: 'city', label: 'City', icon: '🏙️' },
  { id: 'adventure', label: 'Adventure', icon: '🪂' },
  { id: 'custom', label: 'Custom', icon: '✨' }
];

const budgetEmojis = {
  1000: '🎯',
  3000: '💎',
  5000: '🌟',
  10000: '👑'
};

export default function TripPreferencesModal({ isOpen, onClose, onComplete }: TripPreferencesModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useLocalStorage<TripPreferences>('tripPreferences', {
    destinationType: '',
    budget: 3000,
    startDate: '',
    endDate: ''
  });

  const [selectedType, setSelectedType] = useState(preferences.destinationType);
  const [budget, setBudget] = useState(preferences.budget);
  const [startDate, setStartDate] = useState(preferences.startDate);
  const [endDate, setEndDate] = useState(preferences.endDate);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleDestinationSelect = (type: string) => {
    setSelectedType(type);
    setPreferences(prev => ({ ...prev, destinationType: type }));
    playSound('ping');
  };

  const handleBudgetChange = (value: number) => {
    setBudget(value);
    setPreferences(prev => ({ ...prev, budget: value }));
    playSound('ping');
  };

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setPreferences(prev => ({ ...prev, startDate: start, endDate: end }));
    playSound('ping');
  };

  const playSound = (type: string) => {
    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.play().catch(() => {});
  };

  const handleComplete = () => {
    onComplete({
      destinationType: selectedType,
      budget,
      startDate,
      endDate
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[600px] max-h-[90vh] bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold gradient-text">Let's craft your dream trip!</h2>
              <p className="text-gray-400 mt-2">Answer 3 quick questions</p>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold">What type of destination interests you?</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {destinationTypes.map((type) => (
                        <motion.button
                          key={type.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDestinationSelect(type.id)}
                          className={`p-4 rounded-xl text-center transition-all duration-300 ${
                            selectedType === type.id
                              ? 'bg-blue-500/20 border-2 border-blue-500'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="text-4xl mb-2">{type.icon}</div>
                          <div className="text-white font-semibold">{type.label}</div>
                        </motion.button>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentStep(2)}
                        disabled={!selectedType}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold">What's your budget?</h3>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="1000"
                        max="10000"
                        step="1000"
                        value={budget}
                        onChange={(e) => handleBudgetChange(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>$1,000 {budgetEmojis[1000]}</span>
                        <span>$3,000 {budgetEmojis[3000]}</span>
                        <span>$5,000 {budgetEmojis[5000]}</span>
                        <span>$10,000+ {budgetEmojis[10000]}</span>
                      </div>
                      <div className="text-center text-2xl font-bold">
                        ${budget.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-2 bg-white/5 rounded-full text-white font-semibold"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentStep(3)}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold"
                      >
                        Next
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold">When would you like to travel?</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => handleDateChange(e.target.value, endDate)}
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => handleDateChange(startDate, e.target.value)}
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentStep(2)}
                        className="px-6 py-2 bg-white/5 rounded-full text-white font-semibold"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleComplete}
                        disabled={!startDate || !endDate}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Complete
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 