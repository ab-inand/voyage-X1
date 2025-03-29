/**
 * @file MonitoringDashboard.tsx
 * @copyright 2024 Abhinand. All rights reserved.
 * @license Proprietary
 */

import { useEffect, useState } from 'react';
import { monitoringService } from '@/lib/monitoring';

interface UsageData {
  timestamp: number;
  domain: string;
  ip?: string;
  userAgent?: string;
  location?: string;
  action: 'view' | 'copy' | 'modify';
}

export default function MonitoringDashboard() {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const response = await fetch('https://api.voyage-x1.com/monitoring/data', {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MONITORING_KEY}`
          }
        });
        const data = await response.json();
        setUsageData(data);
      } catch (error) {
        console.error('Failed to fetch usage data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsageData();
    const interval = setInterval(fetchUsageData, 30000); // Refresh every 30 seconds

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

  if (isLoading) {
    return <div className="p-4">Loading monitoring data...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Code Usage Monitoring</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Views</h3>
          <p className="text-3xl text-green-500">
            {usageData.filter(d => d.action === 'view').length}
          </p>
        </div>
        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Copy Attempts</h3>
          <p className="text-3xl text-red-500">
            {usageData.filter(d => d.action === 'copy').length}
          </p>
        </div>
        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Modification Attempts</h3>
          <p className="text-3xl text-yellow-500">
            {usageData.filter(d => d.action === 'modify').length}
          </p>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-4 text-left">Time</th>
              <th className="p-4 text-left">Domain</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {usageData.map((data, index) => (
              <tr key={index} className="border-b border-white/5">
                <td className="p-4">
                  {new Date(data.timestamp).toLocaleString()}
                </td>
                <td className="p-4">{data.domain}</td>
                <td className="p-4">{data.location || 'Unknown'}</td>
                <td className={`p-4 ${getActionColor(data.action)}`}>
                  {data.action.toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 