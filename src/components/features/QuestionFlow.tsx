import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Question {
  id: string;
  text: string;
  type: 'choice' | 'rating' | 'text';
  options?: string[];
  nextQuestion?: string;
}

interface QuestionFlowProps {
  onComplete: (answers: Record<string, any>) => void;
}

const questions: Record<string, Question> = {
  tourPreference: {
    id: 'tourPreference',
    text: 'Do you prefer group tours or private guides?',
    type: 'choice',
    options: ['Group Tours', 'Private Guides', 'Mix of Both'],
    nextQuestion: 'dietary'
  },
  dietary: {
    id: 'dietary',
    text: 'Any dietary restrictions?',
    type: 'choice',
    options: ['None', 'Vegetarian', 'Vegan', 'Halal', 'Kosher'],
    nextQuestion: 'adventure'
  },
  adventure: {
    id: 'adventure',
    text: 'How adventurous are you? Rate from 1-5',
    type: 'rating',
    options: ['1', '2', '3', '4', '5'],
    nextQuestion: 'complete'
  }
};

export default function QuestionFlow({ onComplete }: QuestionFlowProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(questions.tourPreference);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [progress, setProgress] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const calculateProgress = () => {
    const totalQuestions = Object.keys(questions).length;
    const currentIndex = Object.keys(questions).indexOf(currentQuestion.id);
    return ((currentIndex + 1) / totalQuestions) * 100;
  };

  useEffect(() => {
    setProgress(calculateProgress());
  }, [currentQuestion]);

  const handleAnswer = (answer: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    
    if (currentQuestion.nextQuestion && currentQuestion.nextQuestion !== 'complete') {
      setIsTyping(true);
      setTimeout(() => {
        setCurrentQuestion(questions[currentQuestion.nextQuestion!]);
        setIsTyping(false);
      }, 1000);
    } else {
      onComplete(answers);
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent blur-sm" />
      </div>

      {/* Question Display */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-6 gradient-text">{currentQuestion.text}</h2>

            {/* Answer Options */}
            <div className="space-y-4">
              {currentQuestion.type === 'choice' && currentQuestion.options && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentQuestion.options.map((option) => (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnswer(option)}
                      className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'rating' && currentQuestion.options && (
                <div className="flex justify-center space-x-4">
                  {currentQuestion.options.map((rating) => (
                    <motion.button
                      key={rating}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAnswer(parseInt(rating))}
                      className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xl"
                    >
                      {rating}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
          </motion.div>
        )}
      </div>
    </div>
  );
} 