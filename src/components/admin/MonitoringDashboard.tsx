/**
 * @file MonitoringDashboard.tsx
 * @copyright 2024 Abhinand. All rights reserved.
 * @license Proprietary
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UsageData {
  timestamp: number;
  domain: string;
  ip?: string;
  userAgent?: string;
  location?: string;
  action: 'view' | 'copy' | 'modify';
}

interface Stats {
  total_events: number;
  views: number;
  copy_attempts: number;
  modification_attempts: number;
}

export default function MonitoringDashboard() {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_events: 0,
    views: 0,
    copy_attempts: 0,
    modification_attempts: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://oyage-x1-monitoring.onrender.com/monitoring/stats', {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MONITORING_KEY}`
          }
        });
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch monitoring data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'copy':
        return 'text-red-500';
      case 'modify':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'copy':
        return '📋';
      case 'modify':
        return '⚙️';
      default:
        return '👁️';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Code Usage Monitoring</h1>
          <p className="text-gray-400">Real-time monitoring of code access and protection</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 p-6 rounded-xl backdrop-blur-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Total Events</h3>
            <p className="text-3xl font-bold text-blue-400">{stats.total_events}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 p-6 rounded-xl backdrop-blur-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Views</h3>
            <p className="text-3xl font-bold text-green-400">{stats.views}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 p-6 rounded-xl backdrop-blur-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Copy Attempts</h3>
            <p className="text-3xl font-bold text-red-400">{stats.copy_attempts}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 p-6 rounded-xl backdrop-blur-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Modification Attempts</h3>
            <p className="text-3xl font-bold text-yellow-400">{stats.modification_attempts}</p>
          </motion.div>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-4 py-2 rounded-lg ${
                timeRange === '24h' ? 'bg-blue-500' : 'bg-white/5'
              }`}
            >
              24 Hours
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-4 py-2 rounded-lg ${
                timeRange === '7d' ? 'bg-blue-500' : 'bg-white/5'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-4 py-2 rounded-lg ${
                timeRange === '30d' ? 'bg-blue-500' : 'bg-white/5'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 p-6 rounded-xl backdrop-blur-lg mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Activity Overview</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="time" stroke="#ffffff80" />
                <YAxis stroke="#ffffff80" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="copy_attempts"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="modification_attempts"
                  stroke="#eab308"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 p-6 rounded-xl backdrop-blur-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left">Time</th>
                  <th className="p-4 text-left">Action</th>
                  <th className="p-4 text-left">Domain</th>
                  <th className="p-4 text-left">Location</th>
                </tr>
              </thead>
              <tbody>
                {usageData.map((data, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-white/5"
                  >
                    <td className="p-4">
                      {new Date(data.timestamp).toLocaleString()}
                    </td>
                    <td className={`p-4 ${getActionColor(data.action)}`}>
                      <span className="mr-2">{getActionIcon(data.action)}</span>
                      {data.action.toUpperCase()}
                    </td>
                    <td className="p-4">{data.domain}</td>
                    <td className="p-4">{data.location || 'Unknown'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 