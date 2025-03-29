'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  rememberMe?: boolean;
}

export interface AuthRef {
  open: () => void;
}

interface AuthProps {
  defaultMode?: 'login' | 'register';
}

const Auth = forwardRef<AuthRef, AuthProps>(({ defaultMode = 'login' }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(defaultMode === 'login');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: '',
    rememberMe: false
  });

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true)
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (showResetForm) {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Password reset request failed');
        }

        setSuccess('Password reset instructions have been sent to your email');
        setTimeout(() => setShowResetForm(false), 3000);
      } else {
        console.log('Submitting form data:', { ...formData, action: isLogin ? 'login' : 'register' });
        
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            action: isLogin ? 'login' : 'register'
          }),
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (!data.success) {
          throw new Error(data.error || 'Authentication failed');
        }

        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        if (!isLogin) {
          setSuccess('Account created successfully! Please check your email to verify your account.');
          setTimeout(() => {
            setIsOpen(false);
            // Redirect to login page
            window.location.href = '/login';
          }, 3000);
        } else {
          setSuccess('Login successful!');
          setTimeout(() => {
            setIsOpen(false);
            // Redirect to dashboard
            window.location.href = '/dashboard';
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    try {
      const response = await fetch(`/api/auth/${provider}`, {
        method: 'POST',
      });
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      setError('OAuth login failed');
    }
  };

  return (
    <>
      {/* Auth Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl overflow-hidden max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {showResetForm
                      ? 'Reset Password'
                      : isLogin
                      ? 'Welcome Back'
                      : 'Create Account'}
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-2 rounded-lg text-sm">
                    {success}
                  </div>
                )}
                {!showResetForm && !isLogin && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full bg-white/10 rounded-lg px-4 py-2"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full bg-white/10 rounded-lg px-4 py-2"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                {!showResetForm && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input
                      type="password"
                      className="w-full bg-white/10 rounded-lg px-4 py-2"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                )}

                {isLogin && !showResetForm && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-500"
                        checked={formData.rememberMe}
                        onChange={(e) =>
                          setFormData({ ...formData, rememberMe: e.target.checked })
                        }
                      />
                      <span className="ml-2 text-sm text-gray-400">Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="text-sm text-blue-400 hover:text-blue-300"
                      onClick={() => setShowResetForm(true)}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading
                    ? 'Processing...'
                    : showResetForm
                    ? 'Send Reset Instructions'
                    : isLogin
                    ? 'Sign In'
                    : 'Create Account'}
                </motion.button>

                {!showResetForm && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-900 text-gray-400">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOAuthLogin('google')}
                        className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5"
                      >
                        <Image
                          src="/google.svg"
                          alt="Google"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        Google
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOAuthLogin('github')}
                        className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5"
                      >
                        <Image
                          src="/github.svg"
                          alt="GitHub"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        GitHub
                      </motion.button>
                    </div>
                  </>
                )}

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-gray-400 hover:text-white"
                    onClick={() => {
                      if (showResetForm) {
                        setShowResetForm(false);
                      } else {
                        setIsLogin(!isLogin);
                      }
                      setError(null);
                      setSuccess(null);
                    }}
                  >
                    {showResetForm
                      ? 'Back to login'
                      : isLogin
                      ? "Don't have an account? Sign up"
                      : 'Already have an account? Sign in'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default Auth; 