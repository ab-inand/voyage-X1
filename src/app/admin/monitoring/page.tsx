/**
 * @file page.tsx
 * @copyright 2024 Abhinand. All rights reserved.
 * @license Proprietary
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MonitoringDashboard from '@/components/admin/MonitoringDashboard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'login_attempt' | 'api_access' | 'code_copy' | 'code_modify';
  ip: string;
  location: string;
  status: 'success' | 'failed' | 'blocked';
  details: string;
}

interface AdminInfo {
  role: 'admin' | 'trial_admin';
  expiration?: string;
}

export default function AdminMonitoringPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [lastActivity, setLastActivity] = useState<string>('');
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const isTrialAdmin = localStorage.getItem('isTrialAdmin') === 'true';
        const trialExpiration = localStorage.getItem('trialExpiration');

        if (!token) {
          router.push('/admin/login');
          return;
        }

        // Check if trial has expired
        if (isTrialAdmin && trialExpiration) {
          const expirationDate = new Date(trialExpiration);
          if (expirationDate < new Date()) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('isTrialAdmin');
            localStorage.removeItem('trialExpiration');
            router.push('/admin/login');
            return;
          }
        }

        const response = await fetch('/api/admin/auth', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('isTrialAdmin');
          localStorage.removeItem('trialExpiration');
          router.push('/admin/login');
          return;
        }

        const data = await response.json();
        setAdminInfo(data);
        setIsAuthenticated(true);
        fetchSecurityData();
      } catch (error) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isTrialAdmin');
        localStorage.removeItem('trialExpiration');
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    const interval = setInterval(fetchSecurityData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [router]);

  const fetchSecurityData = async () => {
    try {
      const response = await fetch('/api/admin/security', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      setSecurityEvents(data.events);
      setActiveUsers(data.activeUsers);
      setLastActivity(data.lastActivity);
    } catch (error) {
      console.error('Error fetching security data:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const isTrialAdmin = adminInfo?.role === 'trial_admin';
  const daysRemaining = adminInfo?.expiration 
    ? Math.ceil((new Date(adminInfo.expiration).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4">
        {/* Trial Admin Notice */}
        {isTrialAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-yellow-400">Trial Admin Access</h3>
                <p className="text-yellow-300">
                  {daysRemaining} days remaining in your trial period
                </p>
              </div>
              <div className="text-right">
                <p className="text-yellow-300">Expires: {new Date(adminInfo.expiration!).toLocaleDateString()}</p>
                <a
                  href="/contact"
                  className="text-sm text-yellow-400 hover:text-yellow-300 underline"
                >
                  Contact us to upgrade
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Security Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-blue-400">{activeUsers}</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Last Activity</h3>
            <p className="text-3xl font-bold text-purple-400">{lastActivity}</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Security Status</h3>
            <p className="text-3xl font-bold text-green-400">Protected</p>
          </div>
        </motion.div>

        {/* Security Events Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Security Events</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={securityEvents}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="timestamp" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="login_attempts"
                  stroke="#3B82F6"
                  name="Login Attempts"
                />
                <Line
                  type="monotone"
                  dataKey="api_access"
                  stroke="#8B5CF6"
                  name="API Access"
                />
                <Line
                  type="monotone"
                  dataKey="code_copy"
                  stroke="#EF4444"
                  name="Code Copy Attempts"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Security Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Recent Security Events</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="pb-4">Time</th>
                  <th className="pb-4">Type</th>
                  <th className="pb-4">IP</th>
                  <th className="pb-4">Location</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Details</th>
                </tr>
              </thead>
              <tbody>
                {securityEvents.map((event) => (
                  <tr key={event.id} className="border-t border-gray-800">
                    <td className="py-3 text-gray-300">{new Date(event.timestamp).toLocaleString()}</td>
                    <td className="py-3 text-gray-300">{event.type}</td>
                    <td className="py-3 text-gray-300">{event.ip}</td>
                    <td className="py-3 text-gray-300">{event.location}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        event.status === 'success' ? 'bg-green-500/20 text-green-400' :
                        event.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-300">{event.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 