'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    question: 'What excites you most about future travel?',
    options: [
      { text: 'Space Tourism', value: 'space' },
      { text: 'Underwater Hotels', value: 'underwater' },
      { text: 'Hyperloop Journeys', value: 'hyperloop' },
      { text: 'All of the Above', value: 'all' }
    ]
  },
  {
    question: 'How would you describe your travel style?',
    options: [
      { text: 'Adventurous Pioneer', value: 'pioneer' },
      { text: 'Luxury Seeker', value: 'luxury' },
      { text: 'Tech Enthusiast', value: 'tech' },
      { text: 'Environmental Conscious', value: 'eco' }
    ]
  },
  {
    question: 'What\'s your ideal travel duration?',
    options: [
      { text: 'Weekend Getaway', value: 'short' },
      { text: 'Week-long Adventure', value: 'medium' },
      { text: 'Extended Exploration', value: 'long' },
      { text: 'Permanent Residence', value: 'permanent' }
    ]
  }
];

const badges = {
  pioneer: {
    title: 'Zero-G Pioneer',
    description: 'You\'re ready to push the boundaries of human exploration!',
    discount: '5% off orbital stays',
    color: 'from-blue-400 to-purple-600'
  },
  luxury: {
    title: 'Luxury Explorer',
    description: 'You appreciate the finest experiences in travel!',
    discount: '10% off underwater suites',
    color: 'from-purple-400 to-pink-600'
  },
  tech: {
    title: 'Tech Innovator',
    description: 'You\'re at the forefront of travel technology!',
    discount: '15% off Hyperloop tickets',
    color: 'from-green-400 to-blue-600'
  },
  eco: {
    title: 'Eco Traveler',
    description: 'You care about sustainable and responsible travel!',
    discount: '20% off eco-friendly stays',
    color: 'from-green-400 to-teal-600'
  }
};

const FutureTravelerQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const determineBadge = () => {
    const answerCounts = answers.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const maxAnswer = Object.entries(answerCounts).reduce((a, b) => 
      (answerCounts[a] > answerCounts[b] ? a : b)
    );

    return badges[maxAnswer as keyof typeof badges];
  };

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Future Traveler Quiz
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Take our quiz to discover your travel personality and earn a unique NFT badge!
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key="question"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-8"
              >
                <div className="mb-8">
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-400">Question {currentQuestion + 1} of {questions.length}</span>
                    <span className="text-gray-400">{Math.round((currentQuestion + 1) / questions.length * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-6">
                  {questions[currentQuestion].question}
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option.value)}
                      className="p-4 bg-white/10 hover:bg-white/20 rounded-lg text-white text-left transition-colors duration-200"
                    >
                      {option.text}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-8 text-center"
              >
                <h3 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  {determineBadge().title}
                </h3>
                <p className="text-gray-300 mb-6">{determineBadge().description}</p>
                <div className="bg-white/10 rounded-lg p-4 mb-8">
                  <p className="text-xl font-semibold text-white">{determineBadge().discount}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMintNFT}
                  disabled={isMinting}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isMinting ? 'Minting...' : 'Mint Your NFT Badge'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default FutureTravelerQuiz; 