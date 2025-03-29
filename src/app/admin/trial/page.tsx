'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

export default function TrialActivationPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to activate trial');
      }

      // Store the trial token and expiration
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('trialExpiration', data.expiration);
      localStorage.setItem('isTrialAdmin', 'true');

      // Force a hard refresh to ensure the token is properly set
      window.location.href = '/admin/monitoring';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate trial');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-md mx-auto">
          {/* Trial Code Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-6"
          >
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Trial Access Codes</h3>
            <p className="text-blue-300 text-sm">
              Enter your trial access code to get started. Each code provides 7 days of access.
            </p>
            <div className="mt-2 p-3 bg-black/30 rounded-lg">
              <p className="text-blue-300 text-sm">Example codes:</p>
              <p className="text-blue-300 text-sm font-mono">VOYAGEX-2024-001</p>
              <p className="text-blue-300 text-sm font-mono">VOYAGEX-2024-002</p>
              <p className="text-blue-300 text-sm font-mono">VOYAGEX-2024-003</p>
            </div>
            <p className="text-blue-300 text-sm mt-2">
              Need a trial code? Contact us to get one.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl"
          >
            <h1 className="text-3xl font-bold mb-6 gradient-text text-center">
              Activate Trial Access
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Trial Access Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Enter your trial code"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold"
              >
                {isLoading ? 'Activating...' : 'Activate Trial'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 