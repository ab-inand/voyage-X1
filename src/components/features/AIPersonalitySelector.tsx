import { motion } from 'framer-motion';
import { useState } from 'react';

interface AIPersonality {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
}

const personalities: AIPersonality[] = [
  {
    id: 'lexi',
    name: 'Lexi',
    role: 'Futuristic Guide',
    description: "Let's optimize your itinerary with AI magic!",
    avatar: '/avatars/lexi.png',
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'marco',
    name: 'Marco',
    role: 'Adventure Expert',
    description: "I'll find you hidden gems off the tourist trail!",
    avatar: '/avatars/marco.png',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'zara',
    name: 'Zara',
    role: 'Luxury Concierge',
    description: "VIP treatment? Say no more.",
    avatar: '/avatars/zara.png',
    color: 'from-pink-500 to-rose-600'
  }
];

interface AIPersonalitySelectorProps {
  onSelect: (personality: AIPersonality) => void;
}

export default function AIPersonalitySelector({ onSelect }: AIPersonalitySelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (personality: AIPersonality) => {
    setSelectedId(personality.id);
    onSelect(personality);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-4">Choose Your AI Travel Guide</h2>
        <p className="text-gray-400">Select a personality that matches your travel style</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {personalities.map((personality) => (
          <motion.div
            key={personality.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative rounded-2xl overflow-hidden cursor-pointer ${
              selectedId === personality.id
                ? 'ring-2 ring-white/50'
                : 'hover:ring-2 hover:ring-white/30'
            }`}
            onClick={() => handleSelect(personality)}
          >
            {/* Holographic Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${personality.color} opacity-20`} />
            
            {/* Avatar Container */}
            <div className="relative p-6">
              <div className="relative w-32 h-32 mx-auto mb-4">
                {/* Holographic Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent blur-xl" />
                
                {/* Avatar Image */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20">
                  <img
                    src={personality.avatar}
                    alt={personality.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Holographic Glitch Effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-white/50 to-transparent"
                />
              </div>

              {/* Personality Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold mb-1">{personality.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{personality.role}</p>
                <p className="text-sm text-gray-300">{personality.description}</p>
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedId === personality.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
} 